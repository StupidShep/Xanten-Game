from google.appengine.ext import ndb

# Represents a user session
#
# This stores the user information / resources / stats for a given user
# during a game
class User(ndb.Model):

    DEFAULT_FIRST_NAMES  = ['Red', 'Blue', 'Computer Science', 'Dark', 'Pessimistic', 'Lazy', 'Yellow', 'Incredible']
    DEFAULT_SECOND_NAMES = ['Otter', 'Bolt', 'Student', 'Wizard']

    # The user ID
    uid  = ndb.StringProperty()

    # The user's name (human readable)
    name = ndb.StringProperty()

    # The game this user is a member of
    gid  = ndb.StringProperty()

    # Map of their city
    homeMap = ndb.StringProperty()

    # What level their city has reached:
    #   0 = Hamlet
    #   1 = Village
    #   2 = Town
    #   3 = City
    #   4 = Metropolis
    #   5 = Magapolis
    level = ndb.IntegerProperty(default=1)

    # How much Gold the user has
    gold = ndb.IntegerProperty(default=50)

    # How much Food the user has
    food = ndb.IntegerProperty(default=200)

    # How much Wood the user has
    wood = ndb.IntegerProperty(default=200)

    # How much Stone the user has
    stone = ndb.IntegerProperty(default=200)

    # How much people the user has
    people = ndb.IntegerProperty(default=50)

    # The level of their home
    homeLvl = ndb.IntegerProperty(default=1)

    # How many houses the player has
    houses = ndb.IntegerProperty(default=1)

    # Has this player got a trade centre?
    trade = ndb.BooleanProperty(default=False)

    # Has this player got a grapevine?
    grapevine = ndb.BooleanProperty(default=False)

    # Has this player got storage?
    storage = ndb.BooleanProperty(default=False)

    # The level of the storage
    storageLvl = ndb.IntegerProperty(default=1)

    # Has this player got a military centre?
    military = ndb.BooleanProperty(default=False)

    # The level of the military
    militaryLvl = ndb.IntegerProperty(default=1)

    # How many mines has this player got?
    mines = ndb.IntegerProperty(default=0)

    # The level of the mines
    mineLvl = ndb.IntegerProperty(default=1)

    # How many mines has this player got?
    lumberjacks = ndb.IntegerProperty(default=0)

    # The level of the mines
    lumberjackLvl = ndb.IntegerProperty(default=1)

    # How many mines has this player got?
    docks = ndb.IntegerProperty(default=0)

    # The level of the mines
    dockLvl = ndb.IntegerProperty(default=1)