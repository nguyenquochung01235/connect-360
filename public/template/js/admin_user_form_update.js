//DOM elements
const DOMstrings = {
    stepsBtnClass: 'multisteps-form__progress-btn',
    stepsBtns: document.querySelectorAll(`.multisteps-form__progress-btn`),
    stepsBar: document.querySelector('.multisteps-form__progress'),
    stepsForm: document.querySelector('.multisteps-form__form'),
    stepsFormTextareas: document.querySelectorAll('.multisteps-form__textarea'),
    stepFormPanelClass: 'multisteps-form__panel',
    stepFormPanels: document.querySelectorAll('.multisteps-form__panel'),
    stepPrevBtnClass: 'js-btn-prev',
    stepNextBtnClass: 'js-btn-next',
    usernameField: document.querySelector('.username'),
    passwordField: document.querySelector('.password'),
    repasswordField: document.querySelector('.re-password'),
    active: document.querySelector('.active-status'),
    deviceSearchField: document.querySelector('.device-search'),
};


//remove class from a set of items
const removeClasses = (elemSet, className) => {

    elemSet.forEach(elem => {

        elem.classList.remove(className);

    });

};

//return exect parent node of the element
const findParent = (elem, parentClass) => {

    let currentNode = elem;

    while (!currentNode.classList.contains(parentClass)) {
        currentNode = currentNode.parentNode;
    }

    return currentNode;

};

//get active button step number
const getActiveStep = elem => {
    return Array.from(DOMstrings.stepsBtns).indexOf(elem);
};

//set all steps before clicked (and clicked too) to active
const setActiveStep = activeStepNum => {

    //remove active state from all the state
    removeClasses(DOMstrings.stepsBtns, 'js-active');

    //set picked items to active
    DOMstrings.stepsBtns.forEach((elem, index) => {

        if (index <= activeStepNum) {
            elem.classList.add('js-active');
        }

    });
};

//get active panel
const getActivePanel = () => {

    let activePanel;

    DOMstrings.stepFormPanels.forEach(elem => {

        if (elem.classList.contains('js-active')) {

            activePanel = elem;

        }

    });

    return activePanel;

};

//open active panel (and close unactive panels)
const setActivePanel = activePanelNum => {

    //remove active class from all the panels
    removeClasses(DOMstrings.stepFormPanels, 'js-active');

    //show active panel
    DOMstrings.stepFormPanels.forEach((elem, index) => {
        if (index === activePanelNum) {

            elem.classList.add('js-active');

            setFormHeight(elem);

        }
    });

};

//set form height equal to current panel height
const formHeight = activePanel => {

    const activePanelHeight = activePanel.offsetHeight;

    DOMstrings.stepsForm.style.height = `${activePanelHeight}px`;

};

const setFormHeight = () => {
    const activePanel = getActivePanel();

    formHeight(activePanel);
};



//PREV/NEXT BTNS CLICK
DOMstrings.stepsForm.addEventListener('click', e => {

    const eventTarget = e.target;

    //check if we clicked on `PREV` or NEXT` buttons
    if (!(eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`) || eventTarget.classList.contains(`${DOMstrings.stepNextBtnClass}`))) {
        return;
    }

    //find active panel
    const activePanel = findParent(eventTarget, `${DOMstrings.stepFormPanelClass}`);

    let activePanelNum = Array.from(DOMstrings.stepFormPanels).indexOf(activePanel);

    //set active step and active panel onclick
    if (eventTarget.classList.contains(`${DOMstrings.stepPrevBtnClass}`)) {
        activePanelNum--;

    } else {

        activePanelNum++;

    }

    setActiveStep(activePanelNum);
    setActivePanel(activePanelNum);

});
const userFormNextButton = document.querySelector('.js-btn-next')
const validateUserCreateForm = () => {
    if (DOMstrings.passwordField.value == DOMstrings.repasswordField.value) {
        userFormNextButton.removeAttribute("disabled")
    }else{
    userFormNextButton.setAttribute("disabled", true)
    }
}


DOMstrings.passwordField.addEventListener("keyup", e => {
    validateUserCreateForm();
})
DOMstrings.repasswordField.addEventListener("keyup", e => {
    validateUserCreateForm();
})


//SETTING PROPER FORM HEIGHT ONLOAD
window.addEventListener('load', setFormHeight, false);

//SETTING PROPER FORM HEIGHT ONRESIZE
window.addEventListener('resize', setFormHeight, false);


DOMstrings.deviceSearchField.addEventListener("keyup", e => {
    let debounceTimer;
    const deviceSearchValue = DOMstrings.deviceSearchField.value.trim();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
            },
            url: "/admin/panel/device-management/search",
            type: "GET",
            data: {
                channel: deviceSearchValue
            },
            success: function (response) {
                if (response.data != null ) {
                    if (response.data.length != 0) {
                        $('.device-list-result tbody').empty();
                        for (let i = 0; i < response.data.length; i++) {
                            const device = response.data[i];
                            $('.device-list-result tbody').append(`
                                <tr>
                                    <td>
                                        <p class="text-sm font-weight-normal mb-0">${device.id_device}</p>
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-normal mb-0">${device.device_name}</p>
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-normal mb-0">${device.channel}</p>
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-normal mb-0">
                                            <span class="badge badge-md 
                                            ${device.active == 1 ? 'bg-gradient-success' : 'bg-gradient-danger'}">
                                            ${device.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                    </td>
                                    <td>
                                        <p class="text-sm font-weight-normal mb-0">
                                            <span class="badge badge-md bg-gradient-success cursor-pointer add-device-into-user-btn" data="${device.channel}" >Add</span>
                                        </p>
                                    </td>
                                </tr>
                            `);
                        }
                    }else{
                        $('.device-list-result tbody').empty();
                        $('.device-list-result tbody').append(`
                                <tr class="device-list-result-empty">
                                    <td colspan="5" class="text-center">No devices search found</td>
                                </tr>
                        `);
                    }
                }else{
                    $('.device-list-result tbody').empty();
                    $('.device-list-result tbody').append(`
                            <tr class="device-list-result-empty">
                                <td colspan="5" class="text-center">No devices search found</td>
                            </tr>
                    `);
                }
            },
            error: function (error) {
                $('.device-list-result tbody').empty();
                $('.device-list-result tbody').append(`
                        <tr class="device-list-result-empty">
                            <td colspan="5" class="text-center">No devices search found</td>
                        </tr>
                `);
            }
        });
    }, 500);
})

$(document).on('click', '.add-device-into-user-btn', function () {
    const searchDeviceElementTR = $(this).parent().parent().parent().html();
    const searchDeviceElementData = $(this).attr('data');
    const listDataAdded = []
    $('.device-list-add tbody tr').each(function () { 
        if(searchDeviceElementData == $(this).find('td:nth-child(5) p span').attr('data')){
            listDataAdded.push(searchDeviceElementData);
        }
    });

    if(listDataAdded.length > 0){
        alert("Device already added");
        return;
    }else{
        $('.device-list-add-empty').hide();
        $('.device-list-add tbody').append(`<tr>${searchDeviceElementTR}</tr>`);
        $('.device-list-add tbody tr:last-child .add-device-into-user-btn')
            .removeClass('add-device-into-user-btn')
            .removeClass('bg-gradient-success')
            .addClass('remove-device-into-user-btn')
            .addClass('bg-gradient-danger')
            .html('Remove');
    }
    
})

$(document).on('click', '.remove-device-into-user-btn', function () {
    $(this).parent().parent().parent().remove();
    if($('.device-list-add tbody tr').length == 1){
        $('.device-list-add-empty').show();
    }
})

$('#submit-create-user-btn').on('click', function (e) {
    e.preventDefault();
    const username = DOMstrings.usernameField.value;
    const password = DOMstrings.passwordField.value;
    const repassword = DOMstrings.repasswordField.value;
    const active = DOMstrings.active.value;
    const devices = [];
    $('.device-list-add tbody tr').each(function () {
        const device = $(this).find('td:nth-child(5) p span').attr('data');
        if(device != undefined && device != null && device != ""){
            devices.push(device);
        }
    });
    var formData = {
        username: username,
        password: password,
        repassword: repassword,
        active: active,
        devices: devices
    }
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
        },
        url: `/admin/panel/user-management/user/${username}/update`,
        type: "POST",
        data: formData,
        encode: true,
        success: function (response) {
            if (response.success == true) {
                window.location.href = "/admin/panel/user-management";
            } else {
                alert("Something went wrong, please try again");s
            }
        },
        error: function (error) {
            console.log(error.responseJSON.message);
            alert(error.responseJSON.message);
        }
    });
});


