// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
    #id = '';

    get id() {
        return this.#id;
    }

    set changeId(newId) {
        this.#id = newId;
    }

    #latitude = '';

    get latitude() {
        return this.#latitude;
    }

    set changeLat(newLat) {
        this.#latitude = newLat;
    }

    #longitude = '';
    
    get longitude() {
        return this.#longitude;
    }

    set changeLong(newLon) {
        this.#longitude = newLon;
    }

    #hashtag = '';
    
    get hashtag() {
        return this.#hashtag;
    }

    set changeHashtag(newHash) {
        this.#hashtag = newHash;
    }

    #name = '';

    get name() {
        return this.#name;
    }

    set changeName(newName) {
        this.#name = newName;
    }

    constructor(latitude, longitude, name, hashtag, id) {
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#name = name;
        this.#hashtag = hashtag;
        this.#id = id;
    }

    toObj() {
        return {latitude : this.latitude, 
                longitude : this.longitude, 
                name : this.name, 
                hashtag : this.hashtag,
                id : this.id};
    }
}

module.exports = GeoTag;
