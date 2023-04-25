// Andrzej Machnik 4I

// Skrypt odpowiedzialny za odczyt danych z formularza i ich wyświetlenie w zakładce 'Dane praktykanta'.
// Funkcja validateStartToEndDate upewnia się, że między podaną przez użytkownika datą początkową
// a końcową jest dokładnie 20 dni roboczych (jako dni wolne od pracy uwzględniane są tylko weekendy).
// Dane persystentne w tej, jak i dalszej części skryptu przechowywane są w LocalStorage przeglądarki.
// ZNANY PROBLEM: Bardzo rzadko zdarza się, że po wysłaniu poprawnie wypełnionego formularza strona się
// po prostu odświeża tak, jakby żaden kod nie został wykonany. Nie jestem w stanie określić w jakich warunkach
// się to dzieje. W konsoli nie pojawia się żaden komunikat.
//-----------------------------------------------------------------------------------------------------------
const input = document.querySelector('#info-input');
const output = document.querySelector('#info-output');
                        
function displayInfo() {
    input.style.display='none';
    output.style.display='block';
                            
    const outputDisplay = document.createElement('section');
    const outputHTML = 
    `<p>Imię i nazwisko ucznia: <span class="info">${localStorage['Name']}</span></p>
    <p>Klasa: <span class="info">${localStorage['ClassID']}</span> Rok szkolny: <span class="info">${localStorage['SchoolYear']}</span></p>
    <p>Opiekun: <span class="info">${localStorage['Mentor']}</span></p>
    <p>Miejsce odbycia praktyki: <span class="info">${localStorage['Place']}</span></p>
    <p>W terminie: od <span class="info">${localStorage['StartDate']}</span> do <span class="info">${localStorage['EndDate']}</span> </p>`;

    outputDisplay.innerHTML = outputHTML;          
    output.prepend(outputDisplay);
                            
    const editBtn = document.querySelector('#editBtn');
    editBtn.addEventListener('click', function() {
        output.style.display='none';
        output.innerHTML='<button id="editBtn">Edytuj</button>';
        localStorage.clear();
        input.style.display='block';
    });
}

function validateStartToEndDate(startDateRaw, endDateRaw) {
    const selectedStartDate = new Date(startDateRaw);
    const selectedEndDate = new Date(endDateRaw);
    const timeBetweenError = document.querySelector('#time-between-error');

    let workingDaysBetween = 0;
    for(loopDate = selectedStartDate; loopDate <= selectedEndDate; loopDate.setDate(loopDate.getDate()+1)) {
        if(loopDate.getDay() != 0 && loopDate.getDay() != 6) {
            workingDaysBetween++;
        }
    }
    //console.log(workingDaysBetween);
    if(workingDaysBetween == 20) {
        timeBetweenError.innerHTML = ''
        return true;
    }
    else {
        timeBetweenError.innerHTML = 'Datę początkową od końcowej powinno dzielić 20 dni roboczych.'
        return false;
    }
}

if(localStorage.Submitted == 'true') {
    displayInfo();
}
else {
    input.addEventListener('submit', function(evt) {
        const startDate = document.querySelector('#start-date');
        const endDate = document.querySelector('#end-date');
        if(!validateStartToEndDate(startDate.value, endDate.value)) {
            evt.preventDefault();
        }
        else {
            const fname = document.querySelector('#fname');
            const lname = document.querySelector('#lname');
            const classID = document.querySelector('#class');
            const schoolYear = document.querySelector('#year');
            
            const place = document.querySelector('#place');
            const mentor = document.querySelector('#mentor');
							
		    localStorage.setItem('Submitted', 'true');
            localStorage.setItem('Name', `${fname.value} ${lname.value}`);
            localStorage.setItem('ClassID', classID.value);
            localStorage.setItem('SchoolYear', schoolYear.value);
            localStorage.setItem('StartDate', startDate.value);
            localStorage.setItem('EndDate', endDate.value);
            localStorage.setItem('Place', place.value);
            localStorage.setItem('Mentor', mentor.value);
            displayInfo();
        }
    });
}
//-----------------------------------------------------------------------------------------------------------

// Skrypt wykorzystywany w zakładce 'Dziennik zdarzeń'=>'Wprowadź nowe zajęcia'.
// Uniemożliwia użytkownikowi wybranie daty zajęć poza wyznaczonym terminem praktyk.
// Uniemożliwia również wybranie dni wolnych (tylko weekendy, nie uwzględnia świąt itp.).
//-----------------------------------------------------------------------------------------------------------
const addTopicForm = document.querySelector('#add-topic-input');
const dayOfLesson = document.querySelector('#day-of-lesson');

dayOfLesson.setAttribute('min', localStorage.StartDate);
dayOfLesson.setAttribute('max', localStorage.EndDate);

function validateWeekday() {
    const dateInput = dayOfLesson.value;
    const selectedDate = new Date(dateInput);
    const selectedDay = selectedDate.getDay();
    const weekdayError = document.querySelector('#weekday-error');
    if(selectedDay == 0 || selectedDay == 6) {
        weekdayError.innerHTML = '&nbspWybierz dzień roboczy.';
        return false;
    }
    else {
        weekdayError.innerHTML = '';
        return true;
    }
}
//-----------------------------------------------------------------------------------------------------------


// Skrypt wykorzystywany w zakładce 'Dziennik zdarzeń'=>'Wprowadź nowe zajęcia'.
// Generuje listę wybieralną z tematami zajęć wg podanego programu nauczania.
// Jeżeli jakieś zajęcia zostały oznaczone jako 'zrealizowane w całości' wczesńiej w formularzu
// to następnym razem nie zostaną one wyświetlone w liście.
// TODO: Można by określić kilka list programu nauczania (np. teachingProgram3I, teachingProgram4P, itd.)
// A następnie do teachingProgram przydzielić program nauczania odpowiadający danej klasie.
// W przypadku klas mieszanych należałoby również sprecyzować zawód.
// W chwili obecnej wszystkie klasy mają taki sam program nauczania, co jest błędne.
//-----------------------------------------------------------------------------------------------------------
const select = document.querySelector('#topics');

const teachingProgram = [
    {
        moduleName: 'Moduł wstępny',
        topics: ['Czynności wstępne i szkolenia, struktura i organizacja pracy informatyków',
                 'Struktura organizacyjna przedsiębiorstwa i elementy przetwarzania informacji']
    },
    {
        moduleName: 'Montaż, naprawa, konserwacja i obsługa sprzętu komputerowego',
        topics: ['Obsługa sprzętu komputerowego, oprogramowania systemowego i diagnostycznego',
                 'Diagnostyka, naprawa urządzeń IT']
    },
    {
        moduleName: 'Systemy informatyczne',
        topics: ['Zasady administrowania systemami informatycznymi i archiwizowania danych',
                 'Dokumentacja technologiczna przetwarzania informacji',
                 'Zapoznanie z programami do administracji lokalnymi sieciami komputerowymi',
                 'Biblioteki oprogramowania i zbiorów danych']
    },
    {
        moduleName: 'Administracja i konserwacja sieci komputerowych i serwerów',
        topics: ['Metody wyszukiwania awarii lokalnej sieci komputerowej. Rodzaje awarii sieciowych i ich przyczyny',
                 'Konfiguracja zapory ogniowej',
                 'Instalacja i konfiguracja systemów Windows',
                 'Instalacja i konfiguracja systmeów Linux',
                 'Procedury serwisowe dotyczące urządzeń sieciowych',
                 'Tworzenie i sposoby naprawy okablowania strukturalnego',
                 'Symulatory programów konfiguracyjnych urządzeń sieciowych']
    },
    {
        moduleName: 'Tworzenie stron i aplikacji internetowych, projektowanie i administacja bazami danych',
        topics: ['Języki programowania aplikacji internetowych',
                 'Tworzenie stron internetowych',
                 'Organizacja przetwarzania danych w aplikacjach www',
                 'Sieciowe bazy danych']
    }
];


teachingProgram.forEach(element => {
    const optGrp = document.createElement('optgroup');
    optGrp.label = `${element.moduleName}`;
    element.topics.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        const isDisabled = localStorage.getItem(opt.value.replace(/[^A-Za-z]+/g,'')+'Disabled');
        if(isDisabled)
            optGrp.append(opt.disabled);
        else
            optGrp.append(opt);
    });
    select.appendChild(optGrp);
});
//-----------------------------------------------------------------------------------------------------------

// Skrypt wykorzystywany w zakładce 'Dziennik zdarzeń'=>'Wprowadź nowe zajęcia'.
// Postanowiłem podać wolne pole do wprowadzenia imienia i nazwiska opiekuna, zamiast gotowej listy opcji,
// ponieważ dzięki temu program jest bardziej elastyczny w zależności od miejsca odbycia praktyki.
// Domyślnie program ustala opiekuna zajęć jako ogólnego opiekuna praktyk.
//-----------------------------------------------------------------------------------------------------------
const teacher = document.querySelector('#teacher');
teacher.setAttribute('value', localStorage.Mentor);
//-----------------------------------------------------------------------------------------------------------

// Skrypt odpowiedzialny za działanie zakładki 'Dziennik zajęć'. 
// Umożliwia przełączanie widoku na stronie między poszczególnymi zakładkami.
// Obsługuje formularz w zakładce 'Wprowadź nowe zajęcia'
// Wyświetla zrealizowane tematy w zakładce 'Zrealizowane tematy',
// które są przechowywane w formacie JSON w LocalStorage.
// Mechanizm wyświetlania danych w zakładce 'Lista tematów' zawarta jest w jednym z skryptów
// znajdujących się poniżej, ponieważ korzysta z dalej utworzonej zmiennej.
// Zakomentowane zmienne na początku skryptu zostały zadeklarowane wcześniej, ale są obecne
// by 'przygrupować' je do większej sekcji.
// ZNANY PROBLEM: Po wysłaniu formularza widok zmienia się na zakładkę 'Zrealizowane tematy',
// jednak nowo wprowadzone zajęcia nie ukażą się tam do chwili odświeżenia strony.
// Jest to spowodowane przez evt.preventDefault(), bez którego strona odświeży się,
// ale domyślnie zmieni widok na 'Dane praktykanta'.
//-----------------------------------------------------------------------------------------------------------
const addTopic = document.querySelector('#add-new-topic');
const realizedTopics = document.querySelector('#realized-topics');
const topicsList = document.querySelector('#topics-list');
const addTopicBtn = document.querySelector('#addTopicBtn');
const realizedTopicsBtn = document.querySelector('#realizedTopicsBtn');
const topicsListBtn = document.querySelector('#topicsListBtn');
// const addTopicForm = document.querySelector('#add-topic-input')
// const dayOfLesson = document.querySelector('#day-of-lesson');
// const select = document.querySelector('#topics');
// const teacher = document.querySelector('#teacher');
const report = document.querySelector('#report');
const isRealized = document.querySelector('#is-realized');
const hours = document.querySelector('#hours');
const grade = document.querySelector('#grade');

addTopicBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    addTopic.style.display = 'block';
    realizedTopics.style.display = 'none';
    topicsList.style.display = 'none';
});

realizedTopicsBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    addTopic.style.display = 'none';
    realizedTopics.style.display = 'block';
    topicsList.style.display = 'none';
});

topicsListBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    addTopic.style.display = 'none';
    realizedTopics.style.display = 'none';
    topicsList.style.display = 'block';
});


addTopicForm.addEventListener('submit', function(evt) {
    if(!validateWeekday()) {
        evt.preventDefault();
    }
    else {
        evt.preventDefault();
        const selectedTopic = document.querySelector('#topics option:checked');
        let existingTopics = JSON.parse(localStorage.getItem('AllTopics'));
        if(existingTopics == null)
            existingTopics = [];
            const realizedTopic = {
                module: selectedTopic.parentElement.label,
                topic: select.value,
                date: dayOfLesson.value,
                teacher: teacher.value,
                hours: hours.value,
                grade: grade.value,
                report: report.value
            };
        localStorage.setItem('RealizedTopic', JSON.stringify(realizedTopic));
        existingTopics.push(realizedTopic);
        localStorage.setItem('AllTopics', JSON.stringify(existingTopics));
        
        const isCompleted = document.querySelector('#is-completed');
        if(isCompleted.checked) {
            selectedTopic.setAttribute('disabled', '');
            const disabledTopic = selectedTopic.value.replace(/[^A-Za-z]+/g,'')+'Disabled';
            localStorage.setItem(disabledTopic, '1');
        }

        addTopic.style.display = 'none';
        realizedTopics.style.display = 'block';
    }
});

const allTopics = JSON.parse(localStorage.getItem('AllTopics'))
if(allTopics != null) {
    for(const topic of allTopics) {
        const elem = document.createElement('section');
        elem.innerHTML =
            `<p>dział: <span class="info">${topic['module']}</span></p>
            <p>temat: <span class="info">${topic['topic']}</span></p>
            <p>opiekun: <span class="info">${topic['teacher']}</span>, data realizacji: <span class="info">${topic['date']}</span>, ilość godzin: <span class="info">${topic['hours']}</span>, ocena: <span class="info">${topic['grade']}</span></p>
            <p>sprawozdanie: <span class="info">${topic['report']}</span></p>`;
        realizedTopics.appendChild(elem);
    }    
}
//-----------------------------------------------------------------------------------------------------------

// Skrypt odpowiedzialny za działanie zakładki 'Podsumowanie'.
// Pole do wystawienia opinii, suwak z oceną i przycisk zatwierdzający są odblokowywane dopiero
// po zrealizowaniu wszystkich 140 godzin. W celach testowych można dodać zajęcia o brakującej
// liczbie godzin, jednak najpierw trzeba usunąć ograniczenie maksymalnej liczby godzin w formularzu.
// Po wystawieniu oceny będzie się ona wyświetlać wraz z proponowaną oceną oraz tabelą z podsumowaniem,
// któremu działowi poświęcono ile czasu.
// Oceny nie można zmienić.
//-----------------------------------------------------------------------------------------------------------
const summaryInput = document.querySelector('#summary-input');
const summaryOutput = document.querySelector('#summary-output');
const opinion = document.querySelector('#opinion');
const table = summaryInput.querySelector('table');
const hoursToBeCompleted = summaryInput.querySelector('p');
const proposedGrade = document.querySelector('#proposed-grade');
const summarySubmitBtn = document.querySelector('#summarySubmitBtn');
const opinionOutput = summaryOutput.querySelector('article');

const moduleSummary = [];
for(const module of teachingProgram) {
    moduleSummary.push({
        name:module['moduleName'],
        hours:0
    });                            
}
let hoursSum = 0;
if(allTopics != null) {
    for(let i=0;i<moduleSummary.length;i++) {
        for(const topic of allTopics) {
            if(moduleSummary[i]['name'] == topic['module']) {
                moduleSummary[i]['hours'] += parseInt(topic['hours']);
            }
        }
        hoursSum += moduleSummary[i]['hours'];
        let row = document.createElement('tr');
        row.innerHTML = `<td>${moduleSummary[i]['name']}</td><td>${moduleSummary[i]['hours']}</td>`;
        table.append(row);
    }
}
const sumRow = document.createElement('tr');
sumRow.innerHTML = `<tr><td>RAZEM:</td><td>${hoursSum}</td></tr>`;
table.append(sumRow);

hoursToBeCompleted.innerHTML = `Pozostało do zrealizowania: <span class="info">${140-hoursSum}</span> h.`;

if(hoursSum == 140 && localStorage.InternshipCompleted != 'true') {
    opinion.disabled = false;
    proposedGrade.disabled = false;
    summarySubmitBtn.disabled = false;

    summarySubmitBtn.addEventListener('click', function() {
        opinionOutput.innerHTML = '<span class="info">'+opinion.value+'</span>';
        const tableClone = table.cloneNode(true);
        summaryOutput.append(tableClone);
        const finalGrade = document.createElement('p');
        finalGrade.innerHTML = 'Proponowana ocena końcowa z praktyki: <span class="info">'+proposedGrade.value+'</span>';
        summaryOutput.append(finalGrade);
        localStorage.setItem('InternshipCompleted', 'true');
        localStorage.setItem('Opinion', opinionOutput.innerHTML);
        localStorage.setItem('FinalSummaryTable', tableClone.innerHTML);
        localStorage.setItem('FinalGrade', finalGrade.innerHTML);
        summaryInput.style.display = 'none';
        summaryOutput.style.display = 'block';
    });
}
else if(localStorage.InternshipCompleted == 'true') {
    opinionOutput.innerHTML = localStorage.Opinion;
    const tableClone = document.createElement('table');
    tableClone.innerHTML = localStorage.FinalSummaryTable;
    summaryOutput.append(tableClone);
    const finalGrade = document.createElement('p');
    finalGrade.innerHTML = localStorage.FinalGrade;
    summaryOutput.append(finalGrade);
    summaryInput.style.display = 'none';
    summaryOutput.style.display = 'block';
}
//-----------------------------------------------------------------------------------------------------------

// Skrypt wykorzystywany w zakładce 'Dziennik zdarzeń'=>'Lista tematów'.
// Lista zawiera spis wszystkich tematów i wyszczególnia
// ile godzin poświęcono na zrealizowanie każdego z nich.
//-----------------------------------------------------------------------------------------------------------
const listTopicsHoursToBeCompleted = document.createElement('p');
listTopicsHoursToBeCompleted.innerHTML = `Pozostało do zrealizowania: <span class="info">${140-hoursSum}</span> h.`;
topicsList.append(listTopicsHoursToBeCompleted);

const hoursSumPerTopic = [];
for(const module of teachingProgram) {
    for(const topic of module.topics) {
        hoursSumPerTopic.push({
            topicName:topic,
            hoursSum:0
    });
    }
}

if(allTopics != null) {
    for(let i=0; i < hoursSumPerTopic.length; i++) {
        for(const topic of allTopics) {
            if(hoursSumPerTopic[i]['topicName'] == topic['topic']) {
                hoursSumPerTopic[i]['hoursSum'] += parseInt(topic['hours']);
            }
        }
    }
}

let i = 0;
for(const module of teachingProgram) {
    const moduleHeading = document.createElement('h4');
    moduleHeading.innerText = module.moduleName;
    topicsList.append(moduleHeading);
    for(const topic of module.topics) {
        const moduleTopic = document.createElement('p');
        moduleTopic.innerHTML = `${topic}, zrealizowano: <span class="info">${hoursSumPerTopic[i++]['hoursSum']}</span> h.`;
        topicsList.append(moduleTopic);
    }
}
//-----------------------------------------------------------------------------------------------------------


// Skrypt obsługujący zmianę widoku między trzema głównymi zakładkami strony.
//-----------------------------------------------------------------------------------------------------------
const info = document.querySelector('#data');
const journal = document.querySelector('#journal');
const summary = document.querySelector('#summary');
const infoBtn = document.querySelector('#infoBtn');
const journalBtn = document.querySelector('#journalBtn');
const summaryBtn = document.querySelector('#summaryBtn');
            
infoBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    info.style.display = 'block';
    summary.style.display = 'none';
    journal.style.display = 'none';
});
/*
journalBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    if(localStorage.Submitted == "true") {
        info.style.display = 'none';
        summary.style.display = 'none';
        journal.style.display = 'block';
    }
    else {
        alert('Wprowadź najpierw dane praktykanta!');
    }
});
            
summaryBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    if(localStorage.Submitted == "true") {
        info.style.display = 'none';
        summary.style.display = 'block';
        journal.style.display = 'none';
    }
    else {
        alert('Wprowadź najpierw dane praktykanta!');
    }
});
*/
if(localStorage.Submitted == 'true') {
	journalBtn.disabled = false;
	summaryBtn.disabled = false;
	
	journalBtn.addEventListener('click', function(evt) {
		evt.preventDefault();
		info.style.display = 'none';
		summary.style.display = 'none';
		journal.style.display = 'block';
	});
            
	summaryBtn.addEventListener('click', function(evt) {
		evt.preventDefault();
		info.style.display = 'none';
		summary.style.display = 'block';
		journal.style.display = 'none';
	});
}
else {
	journalBtn.disabled = true;
	summaryBtn.disabled = true;
}
//-----------------------------------------------------------------------------------------------------------

