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
    deviceNameField: document.querySelector('.device-name'),
    channelField: document.querySelector('.channel'),
    descriptionField: document.querySelector('.device-description'),
    active: document.querySelector('.active-status')
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

const userFormNextButton = document.querySelector('#submit-create-device-btn')
const validateUserCreateForm = () => {
    if (DOMstrings.deviceNameField.value != "" && DOMstrings.channelField.value != "") {
        userFormNextButton.removeAttribute("disabled")

    } else {
        userFormNextButton.setAttribute("disabled", true)
    }
}


DOMstrings.deviceNameField.addEventListener("keyup", e => {
    validateUserCreateForm();
})
DOMstrings.channelField.addEventListener("keyup", e => {
    validateUserCreateForm();
})


//SETTING PROPER FORM HEIGHT ONLOAD
window.addEventListener('load', setFormHeight, false);

//SETTING PROPER FORM HEIGHT ONRESIZE
window.addEventListener('resize', setFormHeight, false);


$('#submit-create-device-btn').on('click', function (e) {
    e.preventDefault();
    const device_name = DOMstrings.deviceNameField.value;
    const channel = DOMstrings.channelField.value;
    const description = DOMstrings.descriptionField.value;
    const active = DOMstrings.active.value;
    var formData = {
        device_name: device_name,
        channel: channel,
        description: description,
        active: active
    }
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", localStorage.getItem('token'));
        },
        url: "/admin/panel/device-management/create",
        type: "POST",
        data: formData,
        encode: true,
        success: function (response) {
            console.log(response);
            if (response.success == true) {
                window.location.href = "/admin/panel/device-management";
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


