import time
import math
import csv
import matplotlib as plt 
import random

class DataColumn:
    # name: Name of data column, range: Tuple of range of values
    def __init__(self, name: str, data_range: tuple[float], variant: str, length: int, periods: float = 0, wave_offset: float = 0, func = lambda x: x):
        self.name : str = name
        self.range : tuple[float] = data_range
        self.variant : str = variant
        self.value : int = 0
        self.length : int = length
        self.periods : float = periods
        self.wave_offset: float = wave_offset
        self.func = func
    
    def get_next_cell(self):
        if self.variant == 'increment':
            return self.increment()
        if self.variant == 'oscillate':
            return self.oscillate()
        if self.variant == 'function':
            return self.function()

    def increment(self):
        if self.value > self.length:
            return -1
        self.value += 1
        return self.range[0] + ((self.value-1) / self.length) * (self.range[1]-self.range[0])

    def oscillate(self):
        if self.value > self.length:
            return -1
        self.value += 1
        return self.range[0] + (self.range[1] - self.range[0])/2 + (self.range[1] - self.range[0])/2  * math.sin(self.wave_offset + random.randint(-100, 100) / 1000 + self.periods * (self.value-1)/self.length * 2 * math.pi)
    
    def function(self):
        if self.value > self.length:
            return -1
        self.value += 1
        return self.range[0] + (self.range[1] - self.range[0])*self.func((self.value-1) / self.length)
        
        

# time_range: tuple of start time and end time, resolution: number of data points
def generate_data(time_range, data_columns : list[DataColumn], resolution):
    interval = DataColumn('unix_seconds', time_range, 'increment', resolution)
    data_columns.insert(0, interval)
    data_header = []
    for c in data_columns:
        data_header.append(c.name)
    data = [data_header]
    x = 0
    while (x != -1):
        data_row = []
        for c in data_columns:
            x = c.get_next_cell()
            if (x == -1):
                print("End")
                return data
            data_row.append(x )#+ random.randint(-100, 100) / 100 * (c.range[1] - c.range[0]) * 0.1)
        data.append(data_row)
    return data
def export_csv(filename, data):
    with open(filename, 'w') as f:
        writer = csv.writer(f, delimiter =';')
        writer.writerows(data)

def oscillate_then_surprise(x):
    if x < 0.4:
        return 0.1 *0.5*(1 + math.sin(100*x))
    elif x > 0.5:
        return 0.1 * 0.5 * (1 + math.sin(100*x))
    else:
        return 0.1 * math.sin(100*x) + 0.9 * math.sin(100*(x-0.9))

resolution = 1200
data = (generate_data((time.time() - 6 * 3600, time.time()),
    [
        DataColumn('pressure', (2.0, 3.0), 'increment', resolution),
        DataColumn('altitude', (-25.0, -22.0), 'oscillate', resolution, periods=17.0),
        DataColumn('deadliness', (0, 10), 'function', resolution, func=oscillate_then_surprise) 
    ],
    resolution
))

heidrun_1_pressure = (generate_data((time.time() - 6 * 3600, time.time()),
    [
        DataColumn('pressure', (2.6, 2.9), 'oscillate', resolution, periods=55),
    ],
    resolution
))

heidrun_1_temperature = (generate_data((time.time() - 6 * 3600, time.time()),
    [
        DataColumn('temperature', (3, 7), 'oscillate', resolution, periods=11),
    ],
    resolution
))

def surprise(x):
    if x < 0.7:
        return 0.5 + 1/20 * math.sin(36*x)
    else:
        return x + -0.7 + 0.5 + 1/20 * math.sin(36*0.7)

heidrun_2_pressure = (generate_data((time.time() - 6 * 3600, time.time()),
    [
        DataColumn('temperature', (0, 3), 'function', resolution, func=surprise),
    ],
    resolution
))

heidrun_2_temperature = (generate_data((time.time() - 6 * 3600, time.time()),
    [
        DataColumn('temperature', (7, 13), 'oscillate', resolution, periods=11),
    ],
    resolution
))

export_csv("heidrun_2_temperature.csv", heidrun_2_temperature)
export_csv("heidrun_2_pressure.csv", heidrun_2_pressure)
export_csv("heidrun_1_pressure.csv", heidrun_1_pressure)
export_csv("heidrun_1_temperature.csv", heidrun_1_temperature)


fish_swam_past = (generate_data((time.time() - 4 * 3600, time.time()),
    [
        DataColumn('fish_swam_past', (0, 30000), 'increment', resolution),
    ],
    resolution
))

export_csv("fisken_fishes.csv", fish_swam_past)