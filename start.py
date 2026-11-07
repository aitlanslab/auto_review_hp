import pyautogui as pilot
import cv2
import time
import numpy as np
import utils.cursors as pointer


def auto_start():
    location=pilot.locateOnScreen("images/shortcuts/brave.png",confidence=0.8)

    if location:
        x,y=pointer.get(location)
        pilot.moveTo(x,y,duration=0.8)
        pilot.doubleClick()
        time.sleep(2)

        location=pilot.locateOnScreen("images/brave/blank_tab.png",confidence=0.8)
        if location:
            location=pilot.locateOnScreen("images/window/maximise.png",confidence=0.8)
            x,y=pointer.get(location)
            pilot.moveTo(x,y,duration=0.8)
            pilot.click()

            time.sleep(2)
            location=pilot.locateOnScreen("images/brave/blank_tab.png",confidence=0.8)
            x,y=pointer.get(location)
            pilot.moveTo(x,y,duration=0.8)
            pilot.rightClick()

            time.sleep(1)
            location=pilot.locateOnScreen("images/brave/split_tabs.png",confidence=0.8)
            x,y=pointer.get(location)
            pilot.moveTo(x,y,duration=0.8)
            pilot.click()

            time.sleep(1)
            location=pilot.locateOnScreen("images/brave/url_bar.png",confidence=0.8)
            x,y=pointer.get(location)
            pilot.moveTo(x,y,duration=0.8)
            pilot.click()
            pilot.typewrite("https://chatgpt.com/?temporary-chat=true",interval=0.05)
            pilot.press("enter")
            time.sleep(1)
            return True








