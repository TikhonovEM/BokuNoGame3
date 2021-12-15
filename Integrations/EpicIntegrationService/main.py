from datetime import datetime
import base64
import requests

from epicstore_api import EpicGamesStoreAPI

from cfg import *


class Offset:
    offset = 0

    def __init__(self):
        with open('offset.txt', 'r') as f:
            self.offset = int(f.readline())

    def save(self):
        with open('offset.txt', 'w') as f:
            self.offset = f.write(str(self.offset))


api = EpicGamesStoreAPI("ru")
verify = False if not VERIFY_SSL else PATH_TO_SSL_CERTIFICATE
offset = Offset()


def main():
    response = requests.get(
        f'{GAMES_API_BASE_ADDRESS}IntegrationInfo/GetAllSystemIds/Epic', verify=verify)
    ids = response.json()

    slugs = get_slugs()
    for slug in list(filter(lambda x: x not in ids, slugs))[0:MAX_PACKET_SIZE]:
        try:
            productInfo = get_product(slug)
            gameId = int()
            try:
                r = requests.post(
                    f'{GAMES_API_BASE_ADDRESS}Game', json=productInfo, verify=verify)
                gameId = int(r.text)
            except Exception as e:
                send_integration_info(slug, True, None)
                print(f'Error while create game with slug = {slug}. {str(e)}')
            send_integration_info(slug, False, gameId)
        except Exception as ex:
            send_integration_info(slug, True, None)
            print(f'Error while get game info with slug = {slug}. {str(ex)}')
    offset.save()


def send_integration_info(slug, hasErrors, gameId):
    info = dict()
    info['ExternalSystemDescriptor'] = 'Epic'
    info['ExternalGameIdStr'] = slug
    info['HasErrors'] = hasErrors
    info['Date'] = datetime.now().isoformat()
    if not hasErrors:
        info['InternalGameId'] = gameId
    response = requests.post(
        f'{GAMES_API_BASE_ADDRESS}IntegrationInfo', json=info, verify=verify)
    if response.status_code == 200:
        offset.offset = offset.offset + 1
    return response


def get_slugs():

    games = api.fetch_store_games(
        product_type='games/edition/base|bundles/games|editors',
        count=MAX_PACKET_SIZE,
        start=offset.offset,
        sort_by='releaseDate',
        sort_dir='ASC',
        allow_countries="RU"
    )
    elements = games["data"]["Catalog"]["searchStore"]["elements"]
    return [el["productSlug"] if not el["productSlug"].endswith("/home") else el["productSlug"].split("/home")[0] for el in elements]


def get_product(slug):
    genres = {
        "ACTION": 1,
        "SIMULATION": 2,
        "STRATEGY": 3,
        "RPG": 4,
        "PUZZLE": 5,
        "ARCADE": 6,
        "RACING": 7
    }
    product = api.get_product(slug)
    productInfo = dict()
    productInfo["Name"] = product["productName"]

    page = product["pages"][0]
    productInfo["Publisher"] = page["data"]["meta"]["publisher"][0]
    productInfo["Developer"] = page["data"]["meta"]["developer"][0]
    logoSrc = page["data"]["hero"]["logoImage"]["src"]
    productInfo["Logo"] = base64.b64encode(
        requests.get(logoSrc).content).decode('utf-8')
    productInfo["ReleaseDate"] = page["data"]["meta"]["releaseDate"]
    genre = 0
    for tag in page["data"]["meta"]["tags"]:
        genre = genres.get(tag.upper(), 0)
        if genre != 0:
            break
    productInfo["Genre"] = genre
    productInfo["Description"] = page["data"]["about"]["description"]
    productInfo["AgeRating"] = str()
    return productInfo


if __name__ == '__main__':
    main()
