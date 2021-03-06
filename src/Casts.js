import moment from 'moment';
import { isArray } from 'lodash';
import { invariant } from './utils';

function checkMomentInstance(attr, value) {
    invariant(
        moment.isMoment(value),
        `Attribute \`${attr}\` is not a moment instance.`
    );
}

export default {
    date: {
        parse(attr, value) {
            if (value === null || value === undefined) {
                return null;
            }
            return moment(value, 'YYYY-MM-DD');
        },
        toJS(attr, value) {
            if (value === null || value === undefined) {
                return null;
            }
            checkMomentInstance(attr, value);
            return value.format('YYYY-MM-DD');
        },
    },
    datetime: {
        parse(attr, value) {
            if (value === null) {
                return null;
            }
            return moment(value);
        },
        toJS(attr, value) {
            if (value === null) {
                return null;
            }
            checkMomentInstance(attr, value);
            return value.toJSON(); // Use ISO8601 notation, adjusted to UTC
        },
    },
    enum: expectedValues => {
        invariant(
            isArray(expectedValues),
            'Invalid argument suplied to `Casts.enum`, expected an instance of array.'
        );
        function checkExpectedValues(attr, value) {
            if (value === null) {
                return null;
            }
            if (expectedValues.includes(value)) {
                return value;
            }
            invariant(
                false,
                `Value set to attribute \`${attr}\`, ${JSON.stringify(
                    value
                )}, is not one of the allowed enum: ${JSON.stringify(
                    expectedValues
                )}`
            );
        }
        return {
            parse: checkExpectedValues,
            toJS: checkExpectedValues,
        };
    },
};
