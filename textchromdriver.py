from selenium import webdriver
from time import sleep
print(sleep)
driver = webdriver.Chrome()
driver.get('https://www.linkedin.com/jobs/')
sleep(1)
username = driver.find_element_by_id('session_key')
username.send_keys('uuuu@gmail,.com')