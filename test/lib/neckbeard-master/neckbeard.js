var definitions = 0;
var clauses = [];

var neckbeard = this.neckbeard = neckbeard || {};

neckbeard.iterate = function() {

    clauses = [];
    definitions = arguments;

    return {

        where: function() {

            valuesOf(arguments).forEach(function(element, index) {
                var iteration = Math.floor(index/definitions.length);
                if (clauses[iteration] === undefined) {
                    clauses[iteration] = [];
                }
                clauses[iteration].push(element);
            });

        }
    };
};

var valuesOf = function(object) {

    var values = [];

    for (var key in object) {
        values.push(object[key]);
    }

    return values;
};

var createDescription = function(description, items) {

    var newDescription = description;

    items.forEach(function(element, index) {
        newDescription = newDescription.replace('#'+definitions[index], element);
    });

    return newDescription;
};

neckbeard.loop = function(description, functionUnderTest) {

    clauses.forEach(function(element, index) {

        return it(createDescription(description, element), function(done) {

            //TODO : Check for the existence of the "done" parameter, at the start, before injecting the done
            // type - for now just assume everything needs it.

            element.unshift(done);
            functionUnderTest.apply(this, element);
        });
    });
};
