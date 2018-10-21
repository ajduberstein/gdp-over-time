import csv

import fiona
from shapely.geometry import shape


path = '/Users/andrewd/Downloads/tl_2017_us_cbsa/tl_2017_us_cbsa.shp'

shp = fiona.open(path)
f = open('./msa_centers.csv', 'w')
w = csv.writer(f)
w.writerow(['msa', 'lat', 'lng', 'area'])
try:
    while shp:
        geojson = shp.next()
        print(geojson)
        if type(geojson) is not dict:
            print('continuing')
            continue
        shp_geom, props = shape(geojson['geometry']), geojson['properties']
        print(props)
        w.writerow([
            props['NAME'],
            float(props['INTPTLAT']),
            float(props['INTPTLON']),
            float(props['ALAND'])])
except StopIteration:
    pass
finally:
    f.close()
