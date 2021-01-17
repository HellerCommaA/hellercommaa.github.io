
class Item {
    constructor(xJson) {
        this.mJson = xJson; // already parsed
    }


    getItemDesc() {
        let ret = '';
        const TYPE = this.mJson.type.toLowerCase();
        // NAMING
        if (TYPE.indexOf('charm') != -1) {
            // we have a charm of some sort
            ret += this.mJson.type;
            ret += '(';
            if (this.mJson.hasOwnProperty('stats')) {
                for (let i = 0; i < this.mJson.stats.length; i++) {
                    // TODO: test this against a multi-stat charm, it's hot garbage
                    let stat = this.mJson.stats[i];
                    ret += '';
                    ret += stat.name.replace('item_', '');
                    ret += ' [';
                    ret += stat.value;
                    ret += ']';
                    if (i + 1 < this.mJson.stats.length) {
                        // if we're NOT last iter
                        ret += ', ';
                    }
                }
            }
            ret += ')';
        } else if (this.mJson.hasOwnProperty('name')) {
            ret += this.mJson.name;
        } else {
            ret += this.mJson.type + ' (' + this.mJson.quality + ')';
        }
        
        ret += ' ';

        // STATS
        if (this.mJson.hasOwnProperty('stats') && this.mJson.stats.length > 0) {
            ret += '(';
            let stats = '';
            for(let i = 0; i < this.mJson.stats.length; i++) {
                let stat = this.mJson.stats[i];
                let added = false; // tells us if we wrote to the string this iter
                if (stat.hasOwnProperty('range')) {
                    // as far as i can tell, this means this is something that 
                    // changes on a given item and will affect value
                    stats += stat.name.replace('item_', '');
                    stats += ' [';
                    stats += stat.value;
                    stats += ']';
                    added = true;
                } else if (stat.hasOwnProperty('name') && stat.name.toLowerCase().indexOf('skill') != -1 && 
                stat.name.toLowerCase().indexOf('charged') == -1) {
                    // that's messy, intentionally excluding 'charged' skills
                    if (stat.hasOwnProperty('chance%')) {
                        stats += stat.skill;
                        stats += '[' + stat.level + ']';
                        stats += ' ' + stat['chance%'] + '% ';
                        stats += stat.name.replace('item_', '');
                    } else if (stat.hasOwnProperty('skill')) {
                        stats += stat.skill;
                        stats += ' [';
                        stats += stat.value;
                        stats += ']';
                        added = true;
                    }
                }
                if (i + 1 < this.mJson.stats.length && added) {
                    // we're not the last item
                    stats += ', ';
                }
            }
            // this are all formatting hacks because i'm lazy
            if (stats.endsWith(', ')) {
                stats = stats.substr(0, stats.length - 2);
            }
            if (stats.endsWith(',')) { 
                // hack to remove trailing comma if things are weird above
                stats = stats.substr(0, stats.length - 1);
            }
            ret += stats;
            ret += ')';
        }
        return ret;
    }

    toString() {
        return '[O] ' + this.getItemDesc();
    }

    toJson() {
        return this.mJson;
    }

}

