# Roomer
## Developer
[Alba Gustems](https://github.com/AGustems)


## Link to App
[Roomer](http://www.google.com)


## Description
Roomer is an app that helps you find your perfect roommate. You can easily browse among all the room adverts and mark your favourites, and when you find that perfect room you can contact the user who posted the advert immediately. On the other hand, if you are looking for a roommate for your current apartment, you can post an advert an with a few simple steps and wait for your perfect roommate to contact you!


## User Stories
* **Room list**: As a user I want to see all the adverts that are currently in the app.
* **Room details**: As a user I want to see all the information of the room that is adverted, to decide if it has everything that I need or not. 
* **Room favourites**: As a user I want to save the adverts that have caught my eye to review them later and think before contacting the adverter. 
* **Sign up**: As a user I want to sign up to the app to see all the information of the app and be able to access all it's features.
* **Log in**: As a user I want to be able to log in to my previously created account to access all the data that I saved
* **Log out**: As a user I want to be able to log out from the app to make sure that no one access it or so that another person can access with their own account.
* **User profile**: As a user I want to access, update or even delete my account.
* **User details**: As a user I want to know the basic information of the advertiser of an add and possible roommate.
* **Create room**: As a user I want to be able to post a room advert so that it appears on the rooms list and possible roommates can access it's information.
* **Add room pictures**: As a user I want to add pictures to my advert so that people can see the house/apartment/other.
* **Add room location**: As a user I want to add the location of the room in my advert so that people interested in the location can see it.


## Backlog
List of the features to include outside the MVP:
* **Social login**: Social login implementation with Facebook and Google, with the possibility to upload the user profile later on to complete the missing information.
* **Build-in chat**: An integrated chat so that the users can speak to one another without having to user the email or third party's chat apps.
* **Interaction markers**: Markers like progress bars for the forms and pages with scroll motion. 


## Routes
#### Auth Routes
Method  |     URL       |   Description                                          |
------- | ------------- | ------------------------------------------------------ |
POST    | /auth/signup  |  Create user and user session. Redirect to /list       |
POST    | /auth/login   |  Create existent user session. Redirect to /list       |
POST    | /auth/logout  |  Destroy current user session. Redirect to /           |

#### User Routes
Method  |     URL                |   Description                                          |
------- | ---------------------- | ------------------------------------------------------ |
GET     | /userprofile/tenant    | Get the user profile with the tenant look (favourites) |
GET     | /userprofile/landlord  | Get the user profile with the landlord look (adds)     |
PUT     | /userprofile/edit      | Update the user data of the user in session            |
DELETE  | /userprofile/delete    | Delete the user data of the user in session of the DB  |
GET     | /user/:id              | Get the public information of a particular user        |

#### Rooms Routes
Method  |     URL                |   Description                                                |
------- | ---------------------- | ------------------------------------------------------------ |
GET     | /rooms                 |  Get the list of all the rooms in the database               |
GET     | /rooms/:id             |  Get the data of a particular room of the database           |
POST    | /rooms/add             |  Create a new room in the database                           |
PUT     | /rooms/:id/edit        |  Edit the data of an existing room (only authorised user)    |
DELETE  | /rooms/:id/delete      |  Delete the room data of the database (only authorised user) |           


## Models
#### Room Model
```
property: enum['house', 'apartment', 'other'],
type: enum['former roommate', 'live-in landlord', 'current tenant'],
location: Location Object ID,
roomdetails: {
  price: Number,
  deposit: Number,
  size: enum[individual, double],
  furniture: Boolean
},
ammenities: {
  livingroom: Boolean,
  internet: Boolean,
  parking: Boolean,
  balcony: Boolean,
  garden: Boolean,
  daccess: Boolean,
},
flatmates:[Number],
bedbath: [Number],
smokers: Boolean,
pets: Boolean,
livewith: {
  guys: Boolean,
  girls: Boolean,
  couples: Boolean,
  smokers: Boolean,
  pets: Boolean,
  students: Boolean,
},
age: [Number],
availability: Date,
bills: enum['yes', 'no', 'some']
adddetails: {
  title: String,
  description: String
}
```

#### User Model
```
type: enum['tenant', 'landlord'],
name: String,
surname: String,
location: Location Object ID,
email: String,
password: String,
description: String,
characteristics: [String],
socials: {
  facebook: String,
  twitter: String,
  instagram: String,
},
favourites: [Room Object ID],
adverts: [Room Object ID]
```

#### Location Model
```
name: String,
address: String,
formatted_address: String,
lat: Number,
lng: Number,
room: Room Object ID
```


## Links
* **Wireframes**: [Roomer Wireframes](https://drive.google.com/drive/folders/1R3W7sfI8RaInJHNq9A_kcw-RFKecBHki?usp=sharing)
* **GitHub Repository**: [Roomer Repository Frontend](https://github.com/AGustems/roomer-frontend), [Roomer Repository Backend](https://github.com/AGustems/roomer-backend)
* **Deployed App**: Soon
* **Trello**: [Trello Board](https://trello.com/b/2dKdlObG/roomer) 
* **Slides**: []()