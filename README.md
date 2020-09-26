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
Method  |     URL           |   Description                                          |
------- | ----------------- | ------------------------------------------------------ |
POST    | /api/auth/signup  |  Create user and user session. Redirect to /list       |
POST    | /api/auth/login   |  Create existent user session. Redirect to /list       |
POST    | /api/auth/logout  |  Destroy current user session. Redirect to /           |
GET     | /api/auth/loggedin|  Checking if there is a user logged                    |

#### User Routes
Method  |     URL                     |   Description                                           |
------- | --------------------------- | ------------------------------------------------------- |
GET     | /api/userprofile/:id        | Get the user profile information                        |
PUT     | /api/userprofile/:id        | Update the user data of the user in session             |
DELETE  | /api/userprofile/:id/delete | Delete the user data of the user in session of the DB   |

#### Rooms Routes
Method  |     URL                   |   Description                                                   |
------- | ------------------------- | --------------------------------------------------------------- |
GET     | /api/rooms                |  Get the list of all the rooms in the database                  |
GET     | /api/rooms/:id            |  Get the data of a particular room of the database              |
PATCH   | /api/rooms/:id            |  Add/remove a room from the user favourites list                |
POST    | /api/rooms/add            |  Create a new room in the database                              |
PUT     | /api/rooms/:id/edit       |  Edit the data of an existing room (only authorised user)       |
DELETE  | /api/rooms/:id/delete     |  Delete the room data of the database (only authorised user)    |           
GET     | /api/rooms/userAds/:id    |  Get the list of all the adds posted by the user                |
GET     | /api/rooms/userOffers/:id |  Get all the offers that the user has recived for his/her adds  |      
PUT     | /api/rooms/:id/newOffer   |  Post a new offer to a room add                                 |
PUT     | /api/rooms/:id/deleteOffer|  Delete a room offer to a room add                              |      


#### Location Routes
Method  |     URL                   |   Description                                                   |
------- | ------------------------- | --------------------------------------------------------------- |
GET     | /api/location             |  Get location a location with google maps API                   |


## Models
#### Room Model
```
owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'You need to be logged in to post an advert']
    },
    property: {
        type: String,
        enum: [
            'House', 'Flat', 'Other'
        ],
        required: [true, 'You need to specify the property type']
    },
    location: {
        lat: {
            type: String,
            required: [true, 'You need to specify the property location']
        },
        lng: {
            type: String,
            required: [true, 'You need to specify the property location']
        },
        direction: {
            type: String,
            required: [true, 'You need to specify the property location']
        }
    },
    images: {
        type: [String],
        match: [
            /^(ftp|http|https):\/\/[^ "]+$/, 'Invalid url'
        ],
        default: ['https://res.cloudinary.com/agustems/image/upload/v1598881434/roomer/no-image_klmdah.png']
    },
    price: {
        type: Number,
        required: [true, 'You need to specify the monthly rent']
    },
    size: {
        type: String,
        enum: [
            'individual', 'double'
        ],
        required: [true, 'You need to specigy the room size']
    },
    availability: Date,
    amenities: {
        living: {
            type: Boolean,
            default: false
        },
        internet: {
            type: Boolean,
            default: false
        },
        parking: {
            type: Boolean,
            default: false
        },
        balcony: {
            type: Boolean,
            default: false
        },
        garden: {
            type: Boolean,
            default: false
        },
        dacces: {
            type: Boolean,
            default: false
        }
    },
    flatmates: {
        type: [Number],
        default: [0, 0]
    },
    bedrooms: {
        type: Number,
        required: true,
        match: [/^(?:[1-9]\d+|[2-9])$/gm, 'There has to be at least one bedroom']
    },
    bathrooms: {
        type: Number,
        required: true,
        match: [/^(?:[1-9]\d+|[1-9])$/gm, 'There has to be at least one bathroom']
    },
    pets: {
        type: Boolean,
        default: false
    },
    smokers: {
        type: Boolean,
        default: false
    },
    tolerance: {
        guys: {
            type: Boolean,
            default: false
        },
        girls: {
            type: Boolean,
            default: false
        },
        couples: {
            type: Boolean,
            default: false
        },
        smokers: {
            type: Boolean,
            default: false
        },
        students: {
            type: Boolean,
            default: false
        },
        pets: {
            type: Boolean,
            default: false
        }
    },
    title: {
        type: String,
        default: 'No title was provided'
    },
    description: {
        type: String,
        default: 'No description was provided'
    },
    offers: [{
        message: String,
        offeror: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }]
}
```

#### User Model
```
name: {
        type: String,
        required: [true, 'The name is required']
    },
    surname: {
        type: String,
        required: [true, 'The surname is required']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        required: [true, 'The email is required'],
    },
    password: {
        type: String,
        required: true
    },
    occupation: {
        type: String,
        default: 'Not Specified'
    },
    imageUrl: {
        type: String,
        match: [
            /^(ftp|http|https):\/\/[^ "]+$/, 'Invalid url'
        ],
        default: 'https://res.cloudinary.com/agustems/image/upload/v1598692094/roomer/newUser_pmu8bv.png'
    },
    age: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: "There isn't any description for this user yet."
    },
    characteristics: [String],
    socials: {
        facebook: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}facebook\.com/gm, 'Invalid Facebook address'
            ],
            default: 'No facebook account information provided'
        },
        twitter: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}twitter\.com/gm, 'Invalid Facebook address'
            ],
            default: 'No twitter account information provided'
        },
        instagram: {
            type: String,
            match: [
                /^(https?:\/\/){0,1}(www\.){0,1}instagram\.com/gm, 'Invalid Instagram address'
            ],
            default: 'No instagram account information provided'
        }
    },
    favourites: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ],
    adverts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    ]
}
```


## Links
* **Wireframes**: [Roomer Wireframes](https://drive.google.com/drive/folders/1R3W7sfI8RaInJHNq9A_kcw-RFKecBHki?usp=sharing)
* **GitHub Repository**: [Roomer Repository Frontend](https://github.com/AGustems/roomer-frontend), [Roomer Repository Backend](https://github.com/AGustems/roomer-backend)
* **Deployed App**: [Roomer Heroku Deployment](https://roomer-app.herokuapp.com/)
* **Trello**: [Trello Board](https://trello.com/b/2dKdlObG/roomer) 
* **Slides**: [Google Slides](https://docs.google.com/presentation/d/1k2gun7eDe3g50GiyUuulCH-vc1K9CdSyvXjoZ1dXHwI/edit?usp=sharing)