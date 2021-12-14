from epicstore_api import EpicGamesStoreAPI
from flask import Flask


app = Flask(__name__)
api = EpicGamesStoreAPI("ru")


def main():
    slugs = get_slugs()
    for slug in slugs[0:5]:
        productInfo = get_product(slug)
        print(productInfo)

def get_slugs():
    games = api.fetch_store_games(
            product_type='games/edition/base|bundles/games|editors',
            count=10,
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
    productInfo["LogoSrc"] = page["data"]["hero"]["logoImage"]["src"]
    productInfo["ReleaseDate"] = page["data"]["meta"]["releaseDate"]
    genre = 0
    for tag in page["data"]["meta"]["tags"]:
        genre = genres.get(tag.upper(), 0)
        if genre != 0:
            break
    productInfo["Genre"] = genre
    productInfo["Description"] = page["data"]["about"]["description"]
    productInfo["AgeRating"] = 0
    return productInfo


if __name__ == '__main__':
    main()