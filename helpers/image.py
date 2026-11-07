import pyautogui as pilot
from pyautogui import ImageNotFoundException

def find(path,confidence=0.8):
    try:
        res=pilot.locateOnScreen(path,confidence=confidence)
        return res
    except ImageNotFoundException as e:
        return None