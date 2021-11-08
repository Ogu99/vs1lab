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

    #latitude = '';

    get latitude() {
        return this.#latitude;
    }

    #longitude = '';
    
    get longitude() {
        return this.#longitude;
    }

    #hashtag = '';
    
    get hashtag() {
        return this.#hashtag;
    }

    #name = '';

    get name() {
        return this.#name;
    }

    constructor(latitude, longitude, name, hashtag) {
        this.#latitude = latitude;
        this.#longitude = longitude;
        this.#name = name;
        this.#hashtag = hashtag;
    }
}

module.exports = GeoTag;
