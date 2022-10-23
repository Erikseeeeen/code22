import pandas as pd
import numpy as np
from scipy import stats
import geopy.distance


def interpolate_temp_in_point(temp_filenames : list, gps_list : list, gps_point : tuple) -> pd.DataFrame:
    """
    Assumptions: temperature data across buoys is samples at the exact same times.
    """
    temp_dfs = [] # List of dataframes, one for each buoy
    weights = [] # List of data point weights
    for gps, temp_filename in zip(gps_list, temp_filenames):
        temp_df = pd.read_csv(temp_filename, sep=";")
        
        p = 2 # Inverse distance weighting parameter
        epsilon = 0.00001 # Smallest distance measurable [km]
        if(geopy.distance.distance(gps, gps_point).km <= epsilon): # Point has a buoy. Return that temp
            return temp_df

        temp_dfs.append(temp_df)
        weights.append(1 / (geopy.distance.distance(gps, gps_point).km**p))

    result_df = temp_dfs[0].copy() # Copy first df to get correct shape
    col_len = len(result_df['temperature'])
    print(col_len, len(weights))
    numerators = [0 for i in range(col_len)]
    denominators = [0 for i in range(col_len)]
    for weight, temp_df in zip(weights, temp_dfs):
        for i in range(len(result_df['temperature'])):
            numerators[i] += weight * temp_df['temperature'][i]
    for i in range(len(numerators)):
        result_df['temperature'][i] = numerators[i]
    for weight, temp_df in zip(weights, temp_dfs):
        for i in range(len(result_df['temperature'])):
            denominators[i] += weight
    for i in range(len(denominators)):
        result_df['temperature'][i] /= denominators[i]
    return result_df

# print(interpolate_temp_in_point(["heidrun_1_temperature.csv","heidrun_2_temperature.csv"], [(0,2), (0,0)], (0,1)))
# print(interpolate_temp_in_point(["heidrun_1_temperature.csv","heidrun_2_temperature.csv"], [(0,2), (0,0)], (0,2)))
# print(interpolate_temp_in_point(["heidrun_1_temperature.csv","heidrun_2_temperature.csv"], [(0,2), (0,0)], (0,0)))