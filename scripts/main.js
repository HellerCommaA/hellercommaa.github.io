
jQuery(() => {

    const ITEM_KEY = 'tm_item_key_v1'; // stored v1 items
    const NAME_KEY = 'tm_name_key_v1'; // stored v1 of name


    const inGameName = $('#inGameName');
    const addItem = $('#addItemBtn'); // add item button
    const generateBtn = $('#generateBtn'); // submit / generate button
    const clearAllBtn = $('#clearAllBtn'); // clear all button
    const item = $('#itemTextArea'); // item text area with json from pd2
    const items = $('#itemsOutArea'); // items output area
    const generatedArea = $('#generatedText'); // generated text area to paste to discord
    const generatedSection = $('#generatedSection'); // section container
    const alertArea = $('#alertArea'); // general alert area
    const wantForItem = $('#wantForItem'); // what the want is for this given item
    const selectAllText = $('#selectAllText'); // select all text in the generated box

    // attempt to load from disk
    getItems();
    getName();
    
    selectAllText.on('click', (e) => {
        e.preventDefault();
        selectText('generatedText');
    });


    clearAllBtn.on('click', (e) => {
        e.preventDefault();
        item.val('');
        alertArea.removeClass('show');
        items.html('');
        item.val('');
        wantForItem.val('');
        generatedArea.html('');
        generatedSection.hide();
    });

    alertArea.on('click', () => { alertArea.removeClass('show'); });

    generateBtn.on('click', generateClicked);
    
    addItem.on('click', addItemClicked);

    function getName() {
        localforage.getItem(NAME_KEY, (err, val) => {
            if (err || val == null) {
                localforage.setItem(NAME_KEY, '', (err) => {
                    // pass
                });
            }
            inGameName.val(val);
        });
    }

    function getItems() {
        localforage.getItem(ITEM_KEY, (err, val) => {
            if (err || val == null) {
                localforage.setItem(ITEM_KEY, [], (err) => {
                    // pass
                });
            } 
            for(let i = 0; i < val.length; i++) {
                loadItem(val[i]);
            }
        })
    }

    function loadItem(xData) {
        // [ITEM, WANT]
        const i = new Item(xData[0]);
        const want = xData[1];
        const wantString = makeWantString(want);
        items.html(items.html() + '<li>' + i.toString() + wantString + '</li>');
        generatedArea.html(generatedArea.html() + i.toString() + wantString + '\n');

    }

    function save(xData) {
        localforage.getItem(ITEM_KEY, (err, items) => {
            if (err) {
                console.error('unable to getItem(ITEM_KEY) during save');
                return;
            }
            items.push(xData);
            localforage.setItem(ITEM_KEY, items, (err) => {
                if (err) {
                    console.error('unable to save new copy of items during save');
                }
            })
        });
    }

    function saveInfo(xData) {
        localforage.setItem(NAME_KEY, xData, (err) => {
            if (err) console.error(err);
        });
    }

    // https://stackoverflow.com/a/1173319
    function selectText(containerid) {
        if (document.selection) { // IE
            var range = document.body.createTextRange();
            range.moveToElementText(document.getElementById(containerid));
            range.select();
        } else if (window.getSelection) {
            var range = document.createRange();
            range.selectNode(document.getElementById(containerid));
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    }

    function addItemClicked(e) {
        e.preventDefault();
        // attempt to prevent BS submissions
        if (item.val() == null || item.val() == '') {
            console.log('empty item entry, bailing');
            return;
        }

        let itmJson = null;
        try { 
            itmJson = JSON.parse(item.val());
        } catch { 
            // pass
        }
        if (itmJson == null) {
            makeAlert('Invalid item JSON detected. Double check your entry.');
            return;
        }
        
        let i = new Item(itmJson);
        const wantString = makeWantString(wantForItem.val());
        items.html(items.html() + '<li>' + i.toString() + wantString + '</li>');

        save([i.toJson(), wantForItem.val()]);

        generatedArea.html(generatedArea.html() + i.toString() + wantString + '\n');


        item.val('');
        wantForItem.val('');
    }

    function makeWantString(xVal) {
        if (xVal == null || xVal == '') return '';
        return ' [W] ' + xVal;
    }

    function generateClicked(e) {
        e.preventDefault();
        const oldHtml = generatedArea.html();

        generatedArea.html('');
        let str = '';
        str += 'Contact here';
        if (inGameName.val() != '') {
            str += ' or /w ' + inGameName.val() + ' in game.';
            saveInfo(inGameName.val());
        }
        str += '\n';
        str += oldHtml;
        str += generateAd();
        generatedArea.html(str);
        generatedSection.show();
    }

    function generateAd() {
        return '---------\nThis trade generated by Trade Manager at hellercommaa.github.io';
    }

    function makeAlert(xMsg) {
        alertArea.text(xMsg);
        alertArea.addClass('show');
    }

});
