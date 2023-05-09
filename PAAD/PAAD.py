import csv
import os
import time
import re
import spotipy
import statistics
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyClientCredentials

#load Spotify credentials from .env file

load_dotenv("creds.env")
CLIENT_ID = os.getenv("CLIENT_ID", "")
CLIENT_SECRET = os.getenv("CLIENT_SECRET", "")
PLAYLIST_LINK = "https://open.spotify.com/playlist/1QsTWDStLDZU8uk0vZJhb9?si=fbb4aadaa5be4bc9"

#Spotify authorization with credentials
client_credentials_manager = SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)

#Create the Spotify session object
session = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

#get Unique Resource Indicator code from playlist URL 
def get_uri(url):
    if match := re.match(r"https://open.spotify.com/playlist/(.*)\?", url):
        playlist_uri = match.groups()[0]
        return playlist_uri
    
    else:
        raise ValueError("link broke - expected format https://open.spotify")



#Create playlist dictionary object
playlist_dict = session.playlist(get_uri(PLAYLIST_LINK))

    
#init lists and values from playlist
no_of_songs = playlist_dict['tracks']['total']
order_list = []
album_list = []
album_type_list = []
release_date_list = []
artists_list = []
cover_url_list = []
popularity_list = []
acousticness_list = []
danceability_list = []
energy_list = []
instrumentalness_list = []
liveness_list = []
loudness_list = []
speechiness_list = []
tempo_list = []
valence_list = []
curr_list = []
temp_list = []
pop_list = []

tracks = playlist_dict["tracks"]
items = tracks["items"]
offset=0
i=0 


#Information gathering loop for each song in playlist
while i<no_of_songs:
    #grab the song's album
    current_album = session.album(items[i-offset]['track']['album']['id'])
    #grab every track in album
    album_tracks = current_album['tracks']
    id_list = [(i['id']) for i in album_tracks['items']]
    #note order/day the album was listened to
    order_list.append(i+1)
    #note album's name
    album_list.append(current_album['name'])
    #note album's type (album, EP, compilation)
    album_type_list.append(current_album['album_type'])
    #note album's release date
    release_date_list.append(current_album['release_date'])
    #note album's cover art
    cover_url_list.append(current_album['images'][0]['url'])
    #note the current popularity of the album on Spotify (LAST UPDATED - MAY 2023)
    popularity_list.append(current_album['popularity'])
    #note album's artist(s)
    if len(current_album['artists']) == 1:
        artists = current_album['artists'][0]['name']
    else:
        artists = [k["name"] for k in current_album['artists']]
        artists = ','.join(artists)
    artists_list.append(artists)
    #trim any songs on album with a duration of less than 30 seconds (audio analysis unattainable, breaks loop)
    for x in range(len(id_list)):
        if session.track(id_list[x])['duration_ms'] < 30000:
            pop_list.append(x)
    #if any songs > 30s, remove from list 
    if pop_list:
        pop_list.reverse()
        for x in range(len(pop_list)):
            id_list.pop(pop_list[x])
        pop_list = []
    #create list of audio features for each track on the album
    temp_list = session.audio_features(id_list)
    #trim any songs Spotify has not released audio analysis for and note the outlier
    for x in range(len(temp_list)):
        if type(temp_list[x]) == type(None):
            print("none type detected at track " + str(x+1))
            pop_list.append(x)
    #if any songs do not have audio analysis available, remove from list 
    if pop_list:
        pop_list.reverse()
        for x in range(len(pop_list)):
            temp_list.pop(pop_list[x])
        pop_list = []
        
    #audio analysis gathering 
    #for each song in album track list, get audio analysis average - repeat for each variable
    for x in range(len(temp_list)):
        #temp list for values
        curr_list.append(temp_list[x]['acousticness'])
        #add temp list to variable's list 
    acousticness_list.append((round(statistics.fmean(curr_list),5)))
    #clear temp list 
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['danceability'])
    danceability_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['energy'])
    energy_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['instrumentalness'])
    instrumentalness_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['liveness'])
    liveness_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['loudness'])
    loudness_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['speechiness'])
    speechiness_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['tempo'])
    tempo_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    for x in range(len(temp_list)):
        curr_list.append(temp_list[x]['valence'])
    valence_list.append((round(statistics.fmean(curr_list),5)))
    curr_list = []
    #bypass Spotify's track array limit of 100 
    if (i+1)%100 == 0:
        #increment tracks list to next 100 songs 
        tracks = session.next(tracks)
        items = tracks["items"]
        offset = i+1
    i+=1
    print("added album",i,"/",no_of_songs,current_album['name'], "by", artists)
    #bypass Spotify's API rate limiting 30s window
    time.sleep(25)
    
#combine date into a .csv file
final_data = list(zip(order_list,artists_list,album_list,album_type_list,release_date_list,cover_url_list,popularity_list,acousticness_list,
                      danceability_list,energy_list,instrumentalness_list,liveness_list,loudness_list,
                      speechiness_list,tempo_list,valence_list))        
rows = final_data
#create csv file
Details = ["Order","Artist(s)","Album","Type","Release Date","Cover Art","Popularity","Acousticness","Danceability","Energy","Instrumentalness",
           "Liveness","Loudness","Speechiness","Tempo","Valence"]


with open("final.csv",'w',encoding="utf-8", newline='') as f:
    write = csv.writer(f)
    write.writerow(Details)
    write.writerows(rows)

f.close()