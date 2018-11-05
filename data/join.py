import pandas as pd

states = pd.read_csv('gdp.csv')
states_2001 = states[states['year'] == '2001-01-01']

states = states.merge(states_2001, on=['msa'])

states['pct_change'] = (states['real_gdp_x'] / states['real_gdp_y']) - 1
states['year'] = states['year_x']
states['year pct_change msa'.split()].to_csv('input_no_geo.csv', index=False)
