import time
import pyautogui as pilot
from pyautogui import ImageNotFoundException
from utils.executor import execute, load_and_click
from utils.cursors import get
from utils.operator import click_element

# Level 0 - check if loggedin
def login_button_visible():
    try:
        res = pilot.locateOnScreen(
            "images/chatgpt/login_btn.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 1 - Check if temporary chat loaded
def temporary_chat_loaded():
    try:
        res = pilot.locateOnScreen(
            "images/chatgpt/temporary_chat_title.png",
            confidence=0.5
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 2 - Check if chatgpt opened
def chatgpt_opened():
    try:
        res1= pilot.locateOnScreen(
            "images/chatgpt/logo.png",
            confidence=0.4
        )
        res2= pilot.locateOnScreen(
            "images/chatgpt/logo2.png",
            confidence=0.4
        )
        if res1 or res2:
            return True
        return False
    except ImageNotFoundException:
        return False

# Level 3 - Temporary chat button is visible 
def chatgpt_regular_mode():
    try:
        res = pilot.locateOnScreen(
            "images/chatgpt/regular_chat.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 4 - check if in another chat
def chatgpt_different_chat():
    try:
        res = pilot.locateOnScreen(
            "images/chatgpt/new_chat.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False

# Level 5 - check if no internet
def no_internet():
    try:
        res = pilot.locateOnScreen(
            "images/window/no_internet.png",
            confidence=0.8
        )
        return res is not None
    except ImageNotFoundException:
        return False



## Operations
def load_chatgpt():
    for i in range(1000):
        is_login_required=execute(login_button_visible,duration=1)
        if not is_login_required:
            temp_chat=execute(temporary_chat_loaded,duration=1)
            if temp_chat:
                print("Temporary Chat loaded")
                return True
            else:
                print("Temporary Chat not loaded")
                # Check if chatgpt loaded
                chatgpt_loaded=execute(chatgpt_opened,duration=1)
                if chatgpt_loaded:
                    print("Chatgpt loaded")
                    # Check if regular mode or in a different chat
                    regular_mode=execute(func=chatgpt_regular_mode,duration=1)
                    different_conversaion=execute(func=chatgpt_different_chat,duration=1)
                    if regular_mode:
                        click_element("images/chatgpt/regular_chat.png",confidence=0.8)
                        time.sleep(0.5)
                        continue
                    else:
                        click_element("images/chatgpt/new_chat.png",confidence=0.8)
                        time.sleep(0.5)
                        continue
                    
                else:
                    print("Seems chat gpt not opened at all")
                    check_internet=execute(func=no_internet,duration=1)
                    if check_internet==True:
                        print("No Internet")
                        return False
                    else:
                        #load_and_click("images/chatgpt/browser_reload.png",duration=1):
                        reload_btn=pilot.locateOnScreen("images/chatgpt/browser_reload.png",confidence=0.8)
                        if reload_btn:
                            load_and_click("images/chatgpt/browser_reload.png",duration=1)
                            load_chatgpt()
                        else:
                            pilot.hotkey("ctrl","2")
                            time.sleep(0.5)
                            pilot.moveTo(652,71,duration=0.5)
                            pilot.click()
                            time.sleep(0.3)
                            pilot.hotkey("ctrl","a")
                            time.sleep(0.3)
                            pilot.typewrite("https://chatgpt.com/?temporary-chat=true",interval=0.08)
                            time.sleep(0.3)
                            pilot.press("enter")
                            time.sleep(0.3)
                            load_chatgpt()
            time.sleep(0.1)
        else:
            from operations.copy_paste_image import chatgpt_login
            chatgpt_login()
            load_chatgpt()

        return False