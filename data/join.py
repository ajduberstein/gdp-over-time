import pandas as pd

states = pd.read_csv('gdp.csv')
us = pd.read_csv('total_gdp.csv')

states = states.merge(us, on=['year'])
states['pct_of_total'] = states['real_gdp'] / states['us_gdp']

states.to_csv('input_no_geo.csv', index=False)
