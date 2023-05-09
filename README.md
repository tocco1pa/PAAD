# PAAD

In 2022, I listened to a different album every day from Jan 1st to Dec 31st - an amazing experience that introduced me to new artists, genres, and ideas. This project is my attempt at visualizing the data collected throughout the experience. 

### Data Collection
Throughout the year i recorded a song from each Album/EP/Compilation in a Spotify playlist to keep track of the music and the order they were listened in. Utilizing Spotipy, a Python library for the Spotify Web API, I collected each album from the playlist and gathered as much data pertaining to each album as possible, spanning from basic information (Album title, Artist(s), Release Date) to complex audio analysis (Valence score, Loudness, Danceability). 
![Screenshot of a portion of the data collected through the Python program](https://i.imgur.com/0pKJmdE.png)
### Calendar Visualization
With 365 albums and their data points in a .csv file, I looked to visualize the data into a calendar to represent each day's corresponding album. Using my HTML/CSS knowledge I edited a free template of a linear calendar site to showcase the year.
![Screenshot of the calendar site's main page](https://i.imgur.com/aN9IisR.png)

Each date cell opens a modal when clicked, showing basic information about the album and a larger version of the cover art.

![Screenshot of a date's modal popup](https://i.imgur.com/sKNNKJT.png)

### Expansion
In later versions of this program I would like to include graphic visualizations such as album type distributions, valence scores over time, and release date distributions.
![Example of graphical data visualization to come](https://i.imgur.com/KuuxHgr.png)
