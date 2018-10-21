from time import sleep

from fredapi import Fred
import pandas as pd

API_KEY = '2c73504b4c5493a98755b5b6d6820281'

fred = Fred(api_key=API_KEY)
links = pd.read_csv('links.csv', sep='|')
dfs = []
nobs = len(links)
for i, row in links.iterrows():
    try:
        data = fred.get_series(row['series_id'])
        print("pulling %s of %s, msa %s" % (i, nobs, row['msa']))
        sleep(.2)
        tmp_df = pd.DataFrame({'real_gdp': data})
        tmp_df['msa'] = row['msa']
        tmp_df = tmp_df.reset_index()
        print(tmp_df.head())
        dfs.append(tmp_df)
    except Exception as e:
        print("Error processing %s: %s" % (row['msa'], e))
dfs = pd.concat(dfs)
dfs.to_csv('gdp.csv', index=False)
dfs = dfs.rename({'index': 'year'})
print(dfs.head())
