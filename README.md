# AirVideos - organize YouTube videos, share with friends!

Add YouTube videos url or code one at a time or add groups of videos.

Goto to 3D WebXR and organize the videos on planes, nameley walls and tables.

# Robot - click it to change between Edit mode and Play mode.

The default mode is Edit if there are unplaced videos, Play otherwise.

On the robot menu click on "walls" to switch between detected and artificial planes.

NOTE: clicking can be done using hand controllers (headsets), mouse or touch.

# Edit mode - visualize the detected planes or artificial planes

Click on a video to select it. Click again to select its group.

Click a plane to join selected videos or unplaced videos to it.

Click a selected plane to unselect its videos and access the menu.

Plane's menu have a Edit switch (Edit <- -> Action) mode and XYZ mirroring.

# Play mode - visualize the videos with yellow or red, if selected, borders.

Click a video to play it and access its menu: Pause, Maximize, Edit switch mode.

Selected videos in 3D have red borders, in 2D they have the upper checkbox active.

# Sharing videos and type of distribution on planes.

In 2D click on the cloud icon at the top.

Create a new user if you don't have one and login.

Add a new group giving a name and pressing the button.

Each group is stored on the cloud and can be private, its default, or public.

Click on the group's link to open a QRcode and link/url sharing popover.

Public groups can be used for hsaring videos and Party/Gaming with them.

# Host and guests connected by a link

To be a host is to login to the cloud, clicking the cloud icon and clicking a link.

To be a guest at a Party/Game is to receive one of those links created by a host.

Everybody connecting at a common link can select videos that are shared with others.

The host can play any of the selected videos on everybody's devices or cast to a TV.

Shared videos selection can be sorted by users or by selected videos. 

# Playing remotely

Players don't have to be in the same space where the videos were organized on planes.

AirVideos does its best to adapt original planes with videos to each user's environment.

Players can uses phones/tablets or WebXR headsets and transition between 2D and 3D.

Players independently switch between detected planes (walls, tables, ...) and artificial ones.

Different gaming strategies can be used and messages can be sent to:
   - everyone connected by a common link (same meeting/party).
   - users that are selected by you through their checkboxes (sorted by users).
   - users that have selected videos that you selected (sorted by videos).

# Info for developers

All the frontend code is available on GitHub.

The backend login/users platform can be developed in any language (I used Java).

The connections are implemented using Firebase but other technologies can be used.

Our aim was to submit to Meta Horizon Start Developer Competition a basic prototype.
It turned out to be easy so a few features were added like video selection sharing.

All code was developed from scratch except for Javascript methods calling cloud API. 

# Next developments

Improve on placing artificial planes manually using IWSDK hand tracking or other means.

Using anchors when plane detection is not available in WebXR (phones, tablets).

Increase the capabilities of adapting to different planes (walls, tables) configurations.

























