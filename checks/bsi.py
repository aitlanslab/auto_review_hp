import time
import pyautogui as pilot
from pyautogui import ImageNotFoundException
from utils.executor import execute, is_element_present, load_and_click
from utils.operator import click_element
from utils.cursors import get
from credentials import email, password
# Level 1 - Check if annotation image loaded completely
def annotation_image_loaded():
    try:
        res1 = pilot.locateOnScreen(
            "images/bsi/annotation_navigations.png",
            confidence=0.5
        )

        res2 = pilot.locateOnScreen(
            "images/window/scroll_bar.png",
            confidence=0.8
        )
        if res1 and res2:
            return True
        return False
    except ImageNotFoundException:
        return False

# Level 2 - Check if annotation page loaded with page title
def annotation_page_loaded():
    try:
        res = pilot.locateOnScreen(
            "images/bsi/annotation_page_header.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 3 - Check if navigation icon is visible
def annotation_nav_loaded():
    try:
        res = pilot.locateOnScreen(
            "images/bsi/annotation_hamburger.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 4 - Check if logged in
def annotation_logged_in():
    try:
        res = pilot.locateOnScreen(
            "images/bsi/login.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False


# Level 5 - Check if tabs are placed correctly
def tabs_placed_correct():
    try:
        comb1 = pilot.locateOnScreen(
            "images/window/tabs_combination_1.png",
            confidence=0.7
        )
        comb2 = pilot.locateOnScreen(
            "images/window/tabs_combination_2.png",
            confidence=0.7
        )
        if comb1 or comb2:
            return True
        return False
    except ImageNotFoundException:
        return False


## Operations
def load_annotation():
    perfect=False
    print("Ready")
    while perfect==False:
        # Step 1: Check if annotation image is loaded
        image_loaded=execute(func=annotation_image_loaded,duration=2)
        page_loaded=execute(func=annotation_page_loaded,duration=2)
        if image_loaded and page_loaded:
            print("Image Loaded")
            # Best case - image loaded with navigation buttons
            perfect=True
            return True
        else:
            # Check if we are on correct page
            page_loaded=execute(func=annotation_page_loaded,duration=2)
            if page_loaded:
                # Page Loaded but image did not came
                print("Correct Page loaded but image did not received")
                if(is_element_present("images/bsi/no_image.png")):
                    pilot.hotkey("ctrl","1")
                    time.sleep(0.3)
                    pilot.hotkey("ctrl","r")
                    time.sleep(1)
                continue
            else:
                # Check if Nav icon is visible
                print("Correct Page not loaded")
                nav_icon_loaded=execute(func=annotation_nav_loaded,duration=2)
                if nav_icon_loaded:
                    print("Got nav icon")
                    # Nav icon is present but page header & image not loaded
                    click_element("images/bsi/annotation_hamburger.png")
                    time.sleep(0.3)
                    pilot.moveTo(51,261,duration=0.5)
                    pilot.click()
                    time.sleep(0.3)
                    continue
                else:
                    print("Check if login is required")
                    login_req=execute(func=annotation_logged_in,duration=1)
                    if login_req:
                        print("Needs to login")
                        click_element("images/bsi/login_email.png")
                        pilot.typewrite(email,interval=0.05)
                        pilot.press("tab")
                        pilot.typewrite(password,interval=0.05)
                        click_element("images/bsi/login_btn.png",confidence=0.8)
                        continue
                    else:
                        print("Check if tabs are placed correctly")
                        tabs_placed=execute(func=tabs_placed_correct,duration=1)
                        if tabs_placed:
                            print("Correct Tab Position")
                            pilot.moveTo(27,24,duration=0.5)
                            pilot.click()
                            continue
                        else:
                            print("Need to abort this operation")
                            return False











    





