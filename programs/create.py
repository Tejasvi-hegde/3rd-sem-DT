

import cv2
import pickle

# Define the width and height of the parking space rectangles
width, height = 70, 150

# Initialize an empty list for parking positions
posList = []

def mouseClick(events, x, y, flags, params):
    if events == cv2.EVENT_LBUTTONDOWN:
        posList.append((x, y))
    if events == cv2.EVENT_RBUTTONDOWN:
        for i, pos in enumerate(posList):
            x1, y1 = pos
            if x1 < x < x1 + width and y1 < y < y1 + height:
                posList.pop(i)

    with open('polygons1', 'wb') as f:
        pickle.dump(posList, f)

while True:
    img = cv2.imread('../public/photo2.jpg')  
    for pos in posList:
        cv2.rectangle(img, pos, (pos[0] + width, pos[1] + height), (255, 0, 255), 2)

    cv2.imshow("Image", img)
    cv2.setMouseCallback("Image", mouseClick)
    key = cv2.waitKey(1)
    if key == ord('q'):
        break

