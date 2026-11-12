<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slimme Examenplanner</title>
    <!-- Tailwind CSS voor moderne styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts: Inter -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Lucide Icons voor strakke iconen -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F8FAFC; /* Blauw/Witte achtergrond */
        }
        /* Custom scrollbar voor een strakke look */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 9999px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        .fade-in {
            animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body class="text-slate-800 antialiased min-h-screen flex flex-col">

    <!-- Navigatiebalk -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
                    <i data-lucide="graduation-cap" class="w-6 h-6"></i>
                </div>
                <div>
                    <h1 class="text-xl font-bold text-slate-900 tracking-tight">StudyFlow</h1>
                    <p class="text-xs text-slate-500 hidden sm:block">Automatische Examen- & Leerplanner</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <button onclick="loadDemoData()" class="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                    <i data-lucide="sparkles" class="w-4 h-4"></i>
                    <span>Voorbeeld laden</span>
                </button>
                <button onclick="clearAllData()" class="text-xs sm:text-sm font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl transition flex items-center gap-1.5" title="Alles wissen">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                    <span class="hidden sm:inline">Wissen</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Notificatie / Meldingen container -->
    <div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"></div>

    <!-- Hoofdinhoud -->
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Tab Navigatie -->
        <div class="flex border-b border-slate-200 mb-8 overflow-x-auto">
            <button id="tab-planning" onclick="switchPage('planning')" class="whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 transition flex items-center gap-2">
                <i data-lucide="calendar-days" class="w-4 h-4"></i> Planning & Voortgang
            </button>
            <button id="tab-vakken" onclick="switchPage('vakken')" class="whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 transition flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4"></i> Vakken Beheren
            </button>
        </div>

        <!-- PAGINA: PLANNING -->
        <div id="page-planning" class="page-section space-y-6 fade-in">
            <!-- Statistieken / Samenvatting balk -->
            <div id="stats-bar" class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                    <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <i data-lucide="calendar-days" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Studiedagen</p>
                        <p id="stat-days" class="text-xl font-bold text-slate-900">0</p>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                    <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                        <i data-lucide="clock" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Totale Leertijd</p>
                        <p id="stat-hours" class="text-xl font-bold text-slate-900">0 u</p>
                    </div>
                </div>
                <div class="col-span-2 sm:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                    <div class="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <i data-lucide="check-circle-2" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-xs text-slate-500 font-medium">Voortgang</p>
                        <p id="stat-progress" class="text-xl font-bold text-slate-900">0%</p>
                    </div>
                </div>
            </div>

            <!-- Hoofdcontainer voor de gegenereerde planning -->
            <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                        <h2 class="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <i data-lucide="list-todo" class="w-5 h-5 text-blue-600"></i>
                            Jouw Automatische Leerplanning
                        </h2>
                        <p class="text-xs text-slate-500 mt-1">Inclusief tijdsduur en wetenschappelijk bewezen leermethodes per sessie.</p>
                    </div>
                    <button onclick="generateSchedule(true)" class="self-start sm:self-auto text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
                        <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
                        <span>Herberekenen</span>
                    </button>
                </div>

                <!-- Filter tabs -->
                <div class="flex gap-2 my-4 overflow-x-auto pb-1">
                    <button onclick="setFilter('all')" id="filter-all" class="filter-btn active px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white transition">Alles tonen</button>
                    <button onclick="setFilter('todo')" id="filter-todo" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Nog te doen</button>
                    <button onclick="setFilter('done')" id="filter-done" class="filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition">Afgerond</button>
                </div>

                <!-- Tijdlijn / Lijst met geplande sessies -->
                <div id="schedule-container" class="space-y-6 mt-4">
                    <!-- Wordt dynamisch gevuld door JavaScript -->
                </div>
            </div>
        </div>

        <!-- PAGINA: VAKKEN -->
        <div id="page-vakken" class="page-section hidden space-y-6 fade-in">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                <!-- Kaart 1: Nieuw vak & stof toevoegen -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div class="flex items-center gap-2.5 mb-5">
                        <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                        <h2 class="text-lg font-bold text-slate-900">Vak & Leerstof Toevoegen</h2>
                    </div>

                    <form id="subject-form" class="space-y-4">
                        <!-- Vaknaam & Kleur -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="sm:col-span-2">
                                <label for="subject-name" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Vaknaam *</label>
                                <input type="text" id="subject-name" placeholder="bijv. Wiskunde B, Geschiedenis" required
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                            </div>
                            <div>
                                <label for="subject-color" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Kleurlabel</label>
                                <select id="subject-color" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                                    <option value="blue">Blauw</option>
                                    <option value="red">Rood</option>
                                    <option value="emerald">Smaragd (Groen)</option>
                                    <option value="rose">Roze</option>
                                    <option value="amber">Oranje / Geel</option>
                                    <option value="purple">Paars</option>
                                    <option value="cyan">Lichtblauw</option>
                                </select>
                            </div>
                        </div>

                        <!-- Examendatum, Moeilijkheidsgraad & Startdagen -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label for="exam-date" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Examendatum *</label>
                                <input type="date" id="exam-date" required
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                            </div>
                            <div>
                                <label for="difficulty" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Niveau</label>
                                <select id="difficulty" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                                    <option value="1">Makkelijk</option>
                                    <option value="2" selected>Gemiddeld</option>
                                    <option value="3">Pittig</option>
                                </select>
                            </div>
                            <div>
                                <label for="days-in-advance" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" title="Hoeveel dagen van tevoren wil je beginnen?">Dagen vooraf *</label>
                                <input type="number" id="days-in-advance" min="1" max="60" value="7" required
                                    class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition">
                            </div>
                        </div>

                        <!-- Leerstof / Onderwerpen toevoegen -->
                        <div>
                            <label for="topics-input" class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Te leren stof / Hoofdstukken *
                            </label>
                            <p class="text-xs text-slate-500 mb-2">Zet elk hoofdstuk of onderwerp op een nieuwe regel (of scheid met een komma).</p>
                            <textarea id="topics-input" rows="3" required placeholder="Hoofdstuk 1: Differentiëren&#10;Hoofdstuk 2: Integreren&#10;Oude examens oefenen"
                                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"></textarea>
                        </div>

                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-sm hover:shadow transition flex items-center justify-center gap-2">
                            <i data-lucide="plus-circle" class="w-5 h-5"></i>
                            <span>Vak toevoegen & Planning updaten</span>
                        </button>
                    </form>
                </div>

                <!-- Kaart 2: Voorkeuren & Lijst met toegevoegde vakken -->
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</div>
                            <h2 class="text-lg font-bold text-slate-900">Jouw Vakken & Instellingen</h2>
                        </div>
                        <span id="subject-count" class="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">0 vakken</span>
                    </div>

                    <!-- Max studietijd per dag instelling -->
                    <div class="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div class="flex justify-between items-center mb-1.5">
                            <label for="max-hours" class="text-xs font-semibold text-slate-700">Maximale studietijd per dag:</label>
                            <span id="max-hours-display" class="text-sm font-bold text-blue-600">3.0 uur</span>
                        </div>
                        <input type="range" id="max-hours" min="1" max="8" step="0.5" value="3" 
                            class="w-full accent-blue-600 cursor-pointer" onchange="generateSchedule()">
                        <div class="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>1 uur (rustig)</span>
                            <span>4 uur (gemiddeld)</span>
                            <span>8 uur (intensief)</span>
                        </div>
                    </div>

                    <!-- Lijst van vakken -->
                    <div id="subjects-list" class="space-y-3">
                        <!-- Wordt dynamisch gevuld -->
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-12 py-6">
        <div class="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
            StudyFlow Examenplanner • Slim plannen met Spaced Repetition & Active Recall
        </div>
    </footer>

    <!-- JAVASCRIPT LOGICA -->
    <script>
        // Initialiseer Lucide iconen
        lucide.createIcons();

        // State variabelen
        let subjects = [];
        let schedule = []; // Array van geplande dagen met taken
        let completedTasks = new Set(); // Houdt ID's bij van afgevinkte taken
        let currentFilter = 'all';

        // Kleurconfiguraties voor Tailwind classes (Aangepast aan nieuw thema)
        const colorStyles = {
            blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
            red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
            emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
            rose: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
            amber: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
            purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
            cyan: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800', dot: 'bg-cyan-500' }
        };

        // Leermethodes
        const studyMethods = {
            learn: {
                title: "Actief Lezen & Samenvatten",
                desc: "Lees de stof door, markeer kernbegrippen en maak een beknopte samenvatting in je eigen woorden.",
                icon: "book-open"
            },
            recall: {
                title: "Active Recall & Flashcards",
                desc: "Sluit je boek en schrijf alles op wat je nog weet. Maak flashcards voor lastige begrippen.",
                icon: "brain"
            },
            practice: {
                title: "Oefenopgaven & Toepassen",
                desc: "Maak oefenvragen of oude examenopgaven over dit onderwerp zonder spieken.",
                icon: "pen-tool"
            },
            review: {
                title: "Eindherhaling & Foutenanalyse",
                desc: "Loop je samenvattingen en eerder gemaakte fouten nog één keer rustig door.",
                icon: "sparkles"
            }
        };

        // Paginatie logica
        function switchPage(pageId) {
            document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
            
            const inactiveClass = "whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 transition flex items-center gap-2";
            const activeClass = "whitespace-nowrap py-3 px-6 text-sm font-semibold border-b-2 border-blue-600 text-blue-600 transition flex items-center gap-2";

            document.getElementById('tab-planning').className = inactiveClass;
            document.getElementById('tab-vakken').className = inactiveClass;
            
            document.getElementById('page-' + pageId).classList.remove('hidden');
            document.getElementById('tab-' + pageId).className = activeClass;
            
            lucide.createIcons();
        }

        window.onload = function() {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 7);
            document.getElementById('exam-date').valueAsDate = tomorrow;
            
            const slider = document.getElementById('max-hours');
            slider.addEventListener('input', (e) => {
                document.getElementById('max-hours-display').textContent = parseFloat(e.target.value).toFixed(1) + ' uur';
            });

            renderSubjects();
            generateSchedule();
        };

        function showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            
            const bgColors = {
                success: 'bg-emerald-600 text-white',
                error: 'bg-red-600 text-white',
                info: 'bg-slate-800 text-white'
            };

            toast.className = `${bgColors[type]} px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center justify-between gap-3 pointer-events-auto fade-in`;
            toast.innerHTML = `
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" class="text-white/80 hover:text-white">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            `;
            container.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => {
                if (toast.parentElement) toast.remove();
            }, 4000);
        }

        // Formulier afhandeling
        document.getElementById('subject-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('subject-name').value.trim();
            const color = document.getElementById('subject-color').value;
            const examDateStr = document.getElementById('exam-date').value;
            const difficulty = parseInt(document.getElementById('difficulty').value);
            const daysInAdvance = parseInt(document.getElementById('days-in-advance').value);
            const rawTopics = document.getElementById('topics-input').value;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const examDate = new Date(examDateStr);
            examDate.setHours(0, 0, 0, 0);

            if (examDate <= today) {
                showToast('Kies een examendatum die in de toekomst ligt.', 'error');
                return;
            }

            const topics = rawTopics
                .split(/[\n,]+/)
                .map(t => t.trim())
                .filter(t => t.length > 0);

            if (topics.length === 0) {
                showToast('Voer minimaal één hoofdstuk of onderwerp in.', 'error');
                return;
            }

            const newSubject = {
                id: 'subj_' + Date.now(),
                name,
                color,
                examDate: examDateStr,
                difficulty,
                daysInAdvance,
                topics
            };

            subjects.push(newSubject);
            
            document.getElementById('subject-name').value = '';
            document.getElementById('topics-input').value = '';

            renderSubjects();
            generateSchedule();
            showToast(`Vak "${name}" toegevoegd en planning bijgewerkt!`, 'success');
        });

        function removeSubject(id) {
            subjects = subjects.filter(s => s.id !== id);
            renderSubjects();
            generateSchedule();
            showToast('Vak verwijderd uit je planning.', 'info');
        }

        function renderSubjects() {
            const list = document.getElementById('subjects-list');
            const countBadge = document.getElementById('subject-count');
            countBadge.textContent = `${subjects.length} ${subjects.length === 1 ? 'vak' : 'vakken'}`;

            if (subjects.length === 0) {
                list.innerHTML = `
                    <div class="text-center py-6 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                        <p class="text-sm text-slate-500 font-medium">Nog geen vakken toegevoegd</p>
                        <p class="text-xs text-slate-400 mt-1">Vul hierboven je vak en leerstof in om te starten.</p>
                    </div>
                `;
                return;
            }

            const sortedSubjects = [...subjects].sort((a, b) => new Date(a.examDate) - new Date(b.examDate));

            list.innerHTML = sortedSubjects.map(subj => {
                const style = colorStyles[subj.color] || colorStyles.blue;
                const formattedDate = formatDateNL(subj.examDate);
                const diffLabels = { 1: 'Makkelijk', 2: 'Gemiddeld', 3: 'Pittig' };

                return `
                    <div class="p-3.5 rounded-xl border ${style.border} ${style.bg} transition relative group">
                        <div class="flex justify-between items-start gap-2">
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="w-2.5 h-2.5 rounded-full ${style.dot}"></span>
                                    <h3 class="font-bold text-sm text-slate-900">${escapeHTML(subj.name)}</h3>
                                </div>
                                <div class="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-600">
                                    <span class="flex items-center gap-1 font-medium">
                                        <i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${formattedDate}
                                    </span>
                                    <span>•</span>
                                    <span>Start: ${subj.daysInAdvance}d vooraf</span>
                                    <span>•</span>
                                    <span>${diffLabels[subj.difficulty]}</span>
                                </div>
                            </div>
                            <button onclick="removeSubject('${subj.id}')" class="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition" title="Vak verwijderen">
                                <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <div class="mt-2.5 pt-2 border-t border-black/5 flex flex-wrap gap-1.5">
                            ${subj.topics.map(t => `<span class="text-[11px] bg-white/80 text-slate-700 px-2 py-0.5 rounded-md border border-black/5">${escapeHTML(t)}</span>`).join('')}
                        </div>
                    </div>
                `;
            }).join('');

            lucide.createIcons();
        }

        // KERNALGORITME AANGEPAST VOOR DAYS IN ADVANCE
        function generateSchedule(notify = false) {
            if (subjects.length === 0) {
                schedule = [];
                renderSchedule();
                updateStats();
                return;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const maxMinutesPerDay = parseFloat(document.getElementById('max-hours').value) * 60;
            let allTasks = [];

            subjects.forEach(subj => {
                const examDate = new Date(subj.examDate);
                examDate.setHours(0, 0, 0, 0);

                // Bereken de startdatum gebaseerd op 'daysInAdvance'
                const startDate = new Date(examDate);
                startDate.setDate(startDate.getDate() - (subj.daysInAdvance || 7));
                
                // Zorg ervoor dat de startdatum niet in het verleden ligt
                if (startDate < today) {
                    startDate.setTime(today.getTime());
                }

                // Aantal beschikbare dagen vanaf de startdatum tot het examen
                const diffTime = examDate - startDate;
                const availableDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                const baseDuration = subj.difficulty === 1 ? 35 : (subj.difficulty === 2 ? 50 : 70);

                subj.topics.forEach((topic, index) => {
                    allTasks.push({
                        id: `${subj.id}_learn_${index}`,
                        subjectId: subj.id,
                        subjectName: subj.name,
                        color: subj.color,
                        examDate: examDate,
                        startDate: startDate, // Bewaar startDate in de taak
                        topic: topic,
                        duration: baseDuration,
                        method: studyMethods.learn,
                        priorityScore: 1,
                        idealDayRatio: (index / (subj.topics.length + 1)) * 0.65 
                    });

                    if (availableDays >= 3) {
                        allTasks.push({
                            id: `${subj.id}_practice_${index}`,
                            subjectId: subj.id,
                            subjectName: subj.name,
                            color: subj.color,
                            examDate: examDate,
                            startDate: startDate, // Bewaar startDate in de taak
                            topic: `${topic} (Oefenen)`,
                            duration: Math.round(baseDuration * 0.75),
                            method: index % 2 === 0 ? studyMethods.practice : studyMethods.recall,
                            priorityScore: 2,
                            idealDayRatio: 0.5 + ((index / subj.topics.length) * 0.35) 
                        });
                    }
                });

                const reviewDate = new Date(examDate);
                reviewDate.setDate(reviewDate.getDate() - 1);
                
                allTasks.push({
                    id: `${subj.id}_final_review`,
                    subjectId: subj.id,
                    subjectName: subj.name,
                    color: subj.color,
                    examDate: examDate,
                    startDate: startDate,
                    topic: `Totale herhaling: ${subj.name}`,
                    duration: subj.difficulty === 3 ? 60 : 45,
                    method: studyMethods.review,
                    priorityScore: 3,
                    forcedDate: reviewDate >= today ? formatDateISO(reviewDate) : formatDateISO(today)
                });
            });

            const dayMap = new Map();

            function getDayBucket(dateStr) {
                if (!dayMap.has(dateStr)) {
                    dayMap.set(dateStr, {
                        date: dateStr,
                        totalMinutes: 0,
                        tasks: [],
                        exams: []
                    });
                }
                return dayMap.get(dateStr);
            }

            subjects.forEach(subj => {
                const bucket = getDayBucket(subj.examDate);
                bucket.exams.push(subj);
            });

            const remainingTasks = [];
            allTasks.forEach(task => {
                if (task.forcedDate) {
                    const bucket = getDayBucket(task.forcedDate);
                    bucket.tasks.push(task);
                    bucket.totalMinutes += task.duration;
                } else {
                    remainingTasks.push(task);
                }
            });

            remainingTasks.sort((a, b) => {
                if (a.examDate.getTime() !== b.examDate.getTime()) {
                    return a.examDate - b.examDate;
                }
                return a.idealDayRatio - b.idealDayRatio;
            });

            // Verdeel overige taken vanaf hun eigen startdatum
            remainingTasks.forEach(task => {
                const totalDaysAvailable = Math.max(1, Math.ceil((task.examDate - task.startDate) / (1000 * 60 * 60 * 24)));
                const targetDayOffset = Math.min(totalDaysAvailable - 1, Math.floor(totalDaysAvailable * task.idealDayRatio));
                
                let placed = false;

                // Zoek vanaf de ideale dag VOORUIT
                for (let offset = targetDayOffset; offset < totalDaysAvailable; offset++) {
                    const candidateDate = new Date(task.startDate);
                    candidateDate.setDate(task.startDate.getDate() + offset);
                    const dateStr = formatDateISO(candidateDate);
                    const bucket = getDayBucket(dateStr);

                    if (bucket.totalMinutes + task.duration <= maxMinutesPerDay) {
                        bucket.tasks.push(task);
                        bucket.totalMinutes += task.duration;
                        placed = true;
                        break;
                    }
                }

                // Zoek vanaf de ideale dag ACHTERUIT
                if (!placed) {
                    for (let offset = targetDayOffset - 1; offset >= 0; offset--) {
                        const candidateDate = new Date(task.startDate);
                        candidateDate.setDate(task.startDate.getDate() + offset);
                        const dateStr = formatDateISO(candidateDate);
                        const bucket = getDayBucket(dateStr);

                        if (bucket.totalMinutes + task.duration <= maxMinutesPerDay) {
                            bucket.tasks.push(task);
                            bucket.totalMinutes += task.duration;
                            placed = true;
                            break;
                        }
                    }
                }

                // Minst drukke dag als er nergens onder het maximum plek is
                if (!placed) {
                    let leastBusyBucket = null;
                    for (let offset = 0; offset < totalDaysAvailable; offset++) {
                        const candidateDate = new Date(task.startDate);
                        candidateDate.setDate(task.startDate.getDate() + offset);
                        const dateStr = formatDateISO(candidateDate);
                        const bucket = getDayBucket(dateStr);

                        if (!leastBusyBucket || bucket.totalMinutes < leastBusyBucket.totalMinutes) {
                            leastBusyBucket = bucket;
                        }
                    }
                    if (leastBusyBucket) {
                        leastBusyBucket.tasks.push(task);
                        leastBusyBucket.totalMinutes += task.duration;
                    }
                }
            });

            schedule = Array.from(dayMap.values())
                .filter(day => day.tasks.length > 0 || day.exams.length > 0)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            renderSchedule();
            updateStats();

            if (notify) {
                showToast('Planning is opnieuw geoptimaliseerd!', 'success');
            }
        }

        function toggleTask(taskId) {
            if (completedTasks.has(taskId)) completedTasks.delete(taskId);
            else completedTasks.add(taskId);
            renderSchedule();
            updateStats();
        }

        function setFilter(filterType) {
            currentFilter = filterType;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('bg-blue-600', 'text-white');
                btn.classList.add('bg-slate-100', 'text-slate-600');
            });
            const activeBtn = document.getElementById(`filter-${filterType}`);
            activeBtn.classList.remove('bg-slate-100', 'text-slate-600');
            activeBtn.classList.add('bg-blue-600', 'text-white');
            renderSchedule();
        }

        function renderSchedule() {
            const container = document.getElementById('schedule-container');

            if (schedule.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-12 px-4">
                        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="calendar-plus" class="w-8 h-8"></i>
                        </div>
                        <h3 class="text-base font-bold text-slate-900">Je planning staat klaar om gevuld te worden</h3>
                        <p class="text-sm text-slate-500 max-w-md mx-auto mt-1.5 mb-5">
                            Ga naar 'Vakken Beheren' en voeg een vak, examendatum en je leerstof toe.
                        </p>
                        <div class="flex flex-wrap items-center justify-center gap-3">
                            <button onclick="switchPage('vakken')" class="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition shadow-sm">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                                <span>Vak Toevoegen</span>
                            </button>
                        </div>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            const todayStr = formatDateISO(new Date());
            const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = formatDateISO(tomorrow);
            let html = '';

            schedule.forEach(day => {
                const visibleTasks = day.tasks.filter(task => {
                    const isDone = completedTasks.has(task.id);
                    if (currentFilter === 'todo') return !isDone;
                    if (currentFilter === 'done') return isDone;
                    return true;
                });

                if (visibleTasks.length === 0 && day.exams.length === 0) return;

                let dayLabel = formatDateNL(day.date, true);
                if (day.date === todayStr) dayLabel = `Vandaag • ${dayLabel}`;
                else if (day.date === tomorrowStr) dayLabel = `Morgen • ${dayLabel}`;
                const totalHours = (day.totalMinutes / 60).toFixed(1).replace('.0', '');

                html += `
                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white fade-in shadow-sm">
                        <div class="bg-stone-50 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-sm text-slate-900">${dayLabel}</span>
                                ${day.date === todayStr ? '<span class="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Focus vandaag</span>' : ''}
                            </div>
                            <div class="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <i data-lucide="clock" class="w-3.5 h-3.5 text-slate-400"></i>
                                <span>Totale studietijd: <strong class="text-slate-800">${day.totalMinutes} min</strong> (${totalHours} uur)</span>
                            </div>
                        </div>

                        ${day.exams.map(exam => `
                            <div class="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center gap-3">
                                <div class="p-2 bg-amber-100 text-amber-700 rounded-xl"><i data-lucide="award" class="w-5 h-5"></i></div>
                                <div>
                                    <p class="text-xs font-bold uppercase tracking-wider text-amber-800">Examendag!</p>
                                    <p class="text-sm font-bold text-slate-900">Examen ${escapeHTML(exam.name)} — Heel veel succes!</p>
                                </div>
                            </div>
                        `).join('')}

                        <div class="p-3 sm:p-4 space-y-3">
                            ${visibleTasks.map(task => {
                                const style = colorStyles[task.color] || colorStyles.blue;
                                const isDone = completedTasks.has(task.id);

                                return `
                                    <div onclick="toggleTask('${task.id}')" 
                                        class="cursor-pointer bg-white p-4 rounded-xl border ${isDone ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-blue-300 shadow-sm'} transition flex items-start gap-3.5 group">
                                        <div class="mt-0.5 flex-shrink-0">
                                            <div class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 group-hover:border-blue-500'}">
                                                ${isDone ? '<i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>' : ''}
                                            </div>
                                        </div>
                                        <div class="flex-grow min-w-0">
                                            <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                <span class="text-xs font-bold px-2.5 py-0.5 rounded-md ${style.badge}">
                                                    ${escapeHTML(task.subjectName)}
                                                </span>
                                                <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                                                    <i data-lucide="timer" class="w-3.5 h-3.5 text-blue-600"></i> ${task.duration} min
                                                </span>
                                            </div>
                                            <h4 class="font-bold text-sm text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}">
                                                ${escapeHTML(task.topic)}
                                            </h4>
                                            <div class="mt-2.5 p-2.5 rounded-lg bg-stone-50 border border-slate-100 flex items-start gap-2.5">
                                                <i data-lucide="${task.method.icon}" class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"></i>
                                                <div>
                                                    <p class="text-xs font-semibold text-slate-800">Aanpak: ${task.method.title}</p>
                                                    <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">${task.method.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            });

            if (html === '') html = `<p class="text-center text-sm text-slate-500 py-8">Geen taken gevonden.</p>`;
            container.innerHTML = html;
            lucide.createIcons();
        }

        function updateStats() {
            let totalMinutes = 0; let totalTasks = 0; let doneCount = 0;
            schedule.forEach(day => {
                totalMinutes += day.totalMinutes;
                day.tasks.forEach(t => {
                    totalTasks++;
                    if (completedTasks.has(t.id)) doneCount++;
                });
            });
            const studyDays = schedule.filter(d => d.tasks.length > 0).length;
            const totalHours = (totalMinutes / 60).toFixed(1).replace('.0', '');
            const progress = totalTasks === 0 ? 0 : Math.round((doneCount / totalTasks) * 100);

            document.getElementById('stat-days').textContent = studyDays;
            document.getElementById('stat-hours').textContent = `${totalHours} u`;
            document.getElementById('stat-progress').textContent = `${progress}%`;
        }

        function loadDemoData() {
            const d1 = new Date(); d1.setDate(d1.getDate() + 5);
            const d2 = new Date(); d2.setDate(d2.getDate() + 8);
            
            subjects = [
                { id: 'demo_1', name: 'Geschiedenis', color: 'blue', examDate: formatDateISO(d1), difficulty: 2, daysInAdvance: 7, topics: ['De Koude Oorlog', 'Jaartallen & Begrippen'] },
                { id: 'demo_2', name: 'Wiskunde B', color: 'cyan', examDate: formatDateISO(d2), difficulty: 3, daysInAdvance: 10, topics: ['Differentiëren', 'Goniometrie'] }
            ];
            completedTasks.clear();
            renderSubjects();
            generateSchedule();
            switchPage('planning');
            showToast('Voorbeeld geladen!', 'success');
        }

        function clearAllData() {
            subjects = []; schedule = []; completedTasks.clear();
            renderSubjects(); renderSchedule(); updateStats();
            switchPage('vakken');
            showToast('Alles gewist.', 'info');
        }

        function formatDateISO(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        function formatDateNL(dateStr, includeWeekday = false) {
            const date = new Date(dateStr);
            const options = { day: 'numeric', month: 'long' };
            if (includeWeekday) options.weekday = 'long';
            const formatted = date.toLocaleDateString('nl-NL', options);
            return formatted.charAt(0).toUpperCase() + formatted.slice(1);
        }

        function escapeHTML(str) {
            return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]));
        }
    </script>
</body>
</html>
