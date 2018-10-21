import pandas as pd

msa = pd.read_csv('./msa_centers.csv')
gdp = pd.read_csv('../data/input_no_geo.csv')

result = msa.merge(gdp)
result.to_csv('../input.csv', index=False)
