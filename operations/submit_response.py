import pyautogui as pilot
import time
from credentials import prompt
from utils.executor import load_and_click, is_element_present, wait_for_first_image
from utils.operator import click_element
import worker
from model import model
def handle_extension():
    # Switch to annotation tab
    pilot.hotkey("ctrl","1")
    time.sleep(0.2)
    pilot.hotkey("ctrl","1")
    time.sleep(0.2)
    path="images/bsi/extension_hp.png" if model=="HP" else "images/bsi/extension.png"
    click_element(path,confidence=0.8)
    time.sleep(0.5)
    path="images/bsi/extension_input_hp.png" if model=="HP" else "images/bsi/extension_input.png"
    click_element(path,confidence=0.8)
    time.sleep(0.5)
    pilot.hotkey("ctrl","v")
    time.sleep(0.5)
    path="images/bsi/extension_fill_hp.png" if model=="HP" else "images/bsi/extension_fill.png"
    click_element(path,confidence=0.8)
    time.sleep(0.2)
    """
    path="images/bsi/extension_save_hp.png" if model=="HP" else "images/bsi/extension_save.png"
    click_element(path,confidence=0.8)
    time.sleep(0.2)
    pilot.moveTo(207,432, duration=0.5)
    """
    #worker.controller.pause()
    print("Checking alert")
    # Check if got response
    path="images/bsi/success.png" if model=="HP" else "images/bsi/success.png"
    if is_element_present(path,duration=1):
        print("- Success")
        pilot.press("enter")
        time.sleep(1)
        return True

    print("checking other alerts")
    path="images/bsi/ok_hp.png"
    if is_element_present(path,duration=5):
        print("Found an alert")
        # Check if IPNI verification required
        path="images/bsi/validate_hp.png" if model=="HP" else "images/bsi/validate.png"
        if is_element_present(path):
            print("IPNI verification required")
            pilot.press("enter")
            print("Enter pressed")
            path="images/bsi/b_ex_hp.png" if model=="HP" else "images/bsi/b_ex.png"
            print(path)
            load_and_click(path,confidence=0.9)
            time.sleep(0.5)
            path="images/bsi/b_ex_out_hp.png" if model=="HP" else "images/bsi/b_ex_out.png"
            if(is_element_present(path,duration=2)):
            
                pilot.press("enter")
                time.sleep(0.5)
                path="images/bsi/i_ex_hp.png" if model=="HP" else "images/bsi/i_ex.png"
                load_and_click(path)
                time.sleep(0.5)
                path="images/bsi/i_ex_input_hp.png" if model=="HP" else "images/bsi/i_ex_input.png"
                load_and_click(path)
                pilot.hotkey('ctrl', 'v')
                time.sleep(0.5)
                path="images/bsi/i_ex_btn_hp.png" if model=="HP" else "images/bsi/i_ex_btn.png"
                load_and_click(path)
                path="images/bsi/i_ex_out_hp.png" if model=="HP" else "images/bsi/i_ex_out.png"
                load_and_click(path)
                pilot.press("enter")
                time.sleep(0.5)
                path="images/bsi/extension_hp.png" if model=="HP" else "images/bsi/extension.png"
                load_and_click(path,confidence=0.8)
                time.sleep(0.5)
                path="images/bsi/extension_input_hp.png" if model=="HP" else "images/bsi/extension_input.png"
                load_and_click(path,confidence=0.8)
                time.sleep(0.5)
                pilot.hotkey("ctrl","v")
                time.sleep(0.5)
                path="images/bsi/extension_fill_hp.png" if model=="HP" else "images/bsi/extension_fill.png"
                load_and_click(path,confidence=0.8)
                #load_and_click("images/bsi/extension_save.png",confidence=0.8)
                time.sleep(0.5)

                possiblilities=["images/bsi/completed.png","images/bsi/reject.png","images/bsi/flag.png"]
                if model=="HP":
                    possiblilities=["images/bsi/completed_hp.png","images/bsi/reject_hp.png","images/bsi/flag_hp.png"]
                res=wait_for_first_image(image_paths=possiblilities, max_time_to_wait=2)
                if res==0 or res==1 or res==2:
                    time.sleep(0.5)
                    print("Received Option")
                    print(res)
                    pilot.press("enter")
                    return True

                return False

        pilot.press("enter")
        time.sleep(0.5)
        return True

    print("No alert found")
    pilot.press("enter")
    time.sleep(0.5)
    return True
    

def submit_response():
    print("Submit Response")
    return handle_extension()