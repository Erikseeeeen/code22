import pandas as pd
import numpy as np
from scipy import stats

def get_suspicious_rows(file):
    """ File: filepath to csv file.
    Output: A tuple containing (row_name, [rows]) which lists rows which are suspicious
    """
    df = pd.read_csv(file, sep=";")
    data = df[df.columns[1]]
    outlier_rows = data[(np.abs(stats.zscore(data, nan_policy="omit") ) > 3.0)]
    if outlier_rows.index.size > 0:
        return outlier_rows.index.tolist()
    return []


def get_suspicious_changes(file):
    """File: filepath to csv file.
    Output: A tuple containing (row_name, [rows]) which lists rows where suspicious changes occured
    """
    df = pd.read_csv(file, sep=";")
    data = df[df.columns[1]].diff()
    outlier_rows = data[(np.abs(stats.zscore(data, nan_policy="omit")) > 3.0)]
    if outlier_rows.index.size > 0:
        return outlier_rows.index.tolist()
    return []

def get_threshold_fails(file, t_low, t_high):
    """File: filepath to csv file.
    Output: A tuple containing (row_name, [rows]) which lists rows where values where outside thresholds
    """
    df = pd.read_csv(file, sep=";")
    data = df.columns[1]
    sus = df[df[data].gt(t_high) | df[data].lt(t_low)]
    return sus.index.tolist()