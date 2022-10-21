import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import IsolationForest
from scipy import stats
from typing import Union


def get_suspicious_rows(file):
    """ File: filepath to csv file.
    Output: A tuple containing (row_name, [rows]) which lists rows which are suspicious
    """
    df = pd.read_csv(file, sep=";")
    rows = []
    for column in df.columns:
        outlier_rows = df[(np.abs(stats.zscore(df[column])) > 3.0)]
        if outlier_rows.index.size > 0:
            rows.append((column, outlier_rows.index.tolist()))
    return rows


def get_suspicious_changes(file):
    """File: filepath to csv file.
    Output: A tuple containing (row_name, [rows]) which lists rows where suspicious changes occured
    """
    df = pd.read_csv(file, sep=";")
    pf = df.diff()
    rows = []
    for column in pf.columns:
        outlier_rows = pf[(np.abs(stats.zscore(pf[column], nan_policy="omit") ) > 3.0)]
        if outlier_rows.index.size > 0:
            rows.append((column, outlier_rows.index.tolist()))
    return rows

print(get_suspicious_changes("data.csv"))