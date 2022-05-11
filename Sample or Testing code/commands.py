from distutils.util import execute
import sqlite3, csv

#Connecting to sqlite
conn = sqlite3.connect('C:/Users/Samma/OneDrive/Desktop/Repositories/Chess/Chess-Game/data.db')

#Creating a cursor object using the cursor() method
cursor = conn.cursor()


cursor.execute("DELETE FROM opening WHERE name = 'name'")
#Commit your changes in the database
conn.commit()

#Closing the connection
conn.close()