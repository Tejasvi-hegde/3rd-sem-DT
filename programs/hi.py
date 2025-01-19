import pickle

with open('polygons1', 'rb') as f:
    posList = pickle.load(f)
print("Saved Positions:", posList)
print("Total Slots Saved:", len(posList))
