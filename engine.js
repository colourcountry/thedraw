(function(){

    var TEST = true;

    var Actor = function(draw,obj) {
        this.draw = draw;

        /* poor man's prototype */
        this.get_original_destination = function() {
                                if (draw.actor_by_id['hel'].hell_on_earth == this.id) {
                                    return '';
                                }
                                return this.destination;
                            };

        var keys = Object.keys(obj);
        for (var i=0; i<keys.length; i++) {
            this[keys[i]] = obj[keys[i]];
        }
    };

    Actor.prototype = {
        id:                 '?',
        name:               '?',
        mentalist:          '',
        destination:        '',
        get_destination:    function() {
                                return (!this.is_vetoed() && !this.is_shafted() && this.get_original_destination()) || '';
                            },
        get_mentalist:      function() {
                                return this.mentalist;
                            },
        veto:               '',
        delegate:           '',
        is_human:           false, /* immutable */
        is_attendee:        false, /* specifically at the final night meal, not on the break as a whole */
        needs_delegate:     false, /* immutable, only for mascots */
        random_delegate:    false, /* immutable, only for mascots */
        is_bummable:        false, /* immutable, only for mascots */
        is_vetoable:        false, /* immutable, only for mascots */
        is_shaftable:       false, /* immutable, only for mascots */
        is_grosserable:     false, /* immutable, only for mascots */
        is_hellable:        false, /* immutable, only for mascots */
        shaft_available:    function() {
                                return (this.is_human && !this.is_attendee && this.destination) ||
                                       (this.is_shaftable && this.get_original_destination())
                                       && 'normal';
                            },
        grosser_available:  function() {
                                return (this.is_human && !this.is_attendee && this.destination) ||
                                       (this.is_grosserable && this.get_original_destination())
                                       && 'normal';
                            },
        is_bummed:          function() {
                                return (this.draw.actor_by_id['glogg'].mascot == this.id &&
                                        this.draw.actor_by_id['glogg'].action == 'bum');
                            },
        is_helped:          function() {
                                return (this.draw.actor_by_id['glogg'].mascot == this.id &&
                                        this.draw.actor_by_id['glogg'].action == 'help');
                            },
        is_vetoed:          function(dest) {
                                /* Parameter is used when this is being evaluated within get_destination,
                                   would cause loop otherwise */
                                if (dest == null) {
                                    dest = this.destination;
                                }
                                return ((this.is_vetoable || this.is_human) &&
                                         this.draw.actor_by_id['kurt'].has_vetoed(dest));
                            },
        is_shafted:         function() {
                                return ((this.is_shaftable || this.is_human) &&
                                         this.draw.actor_by_id['shaft'].shaftee == this.id);
                            }        
    };

    var get_actors = function(draw) {
        return [
            new Actor(draw,
                    {   id:                 'CM',
                        name:               'Chris',
                        destination:        (TEST && 'Tallinn') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true,
                    }),
            new Actor(draw,
                    {   id:                 'DL',
                        name:               'Dave',
                        destination:        (TEST && 'Alghero') || '',
                        mentalist:          (TEST && 'Wroclaw') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true
                    }),
            new Actor(draw,
                    {   id:                 'DT',
                        name:               'David',
                        destination:        (TEST && 'Torshavn') || '',
                        mentalist:          (TEST && 'Davos') || '',
                        veto:               (TEST && 'Tallinn') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true,
                        is_attendee:        (TEST && true) || false
                    }),
            new Actor(draw,
                    {   id:                 'MT',
                        name:               'Mike',
                        destination:        (TEST && 'Luxembourg') || '',
                        mentalist:          (TEST && 'Milwaukee') || '',
                        veto:               (TEST && 'Tallinn') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true,
                        is_attendee:        (TEST && true) || false
                    }),
            new Actor(draw,
                    {   id:                 'RW',
                        name:               'Rupert',
                        destination:        (TEST && 'Gran Canaria') || '',
                        mentalist:          (TEST && 'Berlin') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true,
                        is_attendee:        (TEST && true) || false
                    }),
            new Actor(draw,
                    {   id:                 'SA',
                        name:               'Steve',
                        destination:        (TEST && 'Kangerlussuaq') || '',
                        mentalist:          '',
                        veto:               (TEST && 'Tallinn') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_human:           true,
                        is_attendee:        (TEST && true) || false
                    }),
            new Actor(draw,
                    {   id:                 'lll',
                        name:               'Seamus',
                        destination:        (TEST && 'Ireland') || '',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_vetoable:        true,
                        is_bummable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        get_destination: function() {
                            return (!this.is_bummed() && !this.is_vetoed() && !this.is_shafted() && this.get_original_destination()) || '';
                        }
                    }),
            new Actor(draw,
                    {   id:                 'eric',
                        name:               'Eric',
                        is_bummable:        true,
                        is_hellable:        true,
                    }),
            new Actor(draw,
                    {   id:                 'kurt',
                        name:               'Kurt',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_bummable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        shaft_available:function() {
                                return this.vetoed_destinations().length >= 1;
                                /* FIXME: I have assumed Kurt should only be in if he has vetoed a destination */
                            },
                        has_vetoed: function(destination) {
                            if (!destination || draw.actor_by_id['hel'].hell_on_earth == this.id) {
                                return false;
                            }
                            if (this.is_bummed()) {
                                for (var i=0; i<draw.actors.length; i++) {
                                    if (draw.actors[i].veto != destination) {
                                        return false;
                                    }
                                }
                                return true;
                            } else {
                                var veto_threshold = 3;
                                if (this.is_helped()) {
                                    veto_threshold = 2;
                                }
                                var veto_count = 0;
                                for (var i=0; i<draw.actors.length; i++) {
                                    if (draw.actors[i].veto == destination) {
                                        veto_count++;
                                        if (veto_count >= veto_threshold) {
                                            return true;
                                        }
                                    }
                                }
                                return false;
                            }
                        },
                        unique_destinations: function() {
                            var result = [];
                            for (var i=0; i<draw.actors.length; i++) {
                                if ((draw.actors[i].is_vetoable || draw.actors[i].is_human) &&
                                    draw.actors[i].destination &&
                                    (draw.actor_by_id['hel'].hell_on_earth != draw.actors[i].id) &&
                                    !(result.indexOf(draw.actors[i].destination) >= 0)) {
                                    result.push(draw.actors[i].destination);
                                }
                            }
                            return result;
                        },
                        unique_vetoes: function() {
                            var result = [];
                            for (var i=0; i<draw.actors.length; i++) {
                                if (draw.actors[i].veto &&
                                    !(result.indexOf(draw.actors[i].veto) >= 0)) {
                                    result.push(draw.actors[i].veto);
                                }
                            }
                            return result;
                        },
                        vetoed_destinations: function() {
                            var result = [];
                            var voted_for = this.unique_vetoes();
                            for (var i=0; i<voted_for.length; i++) {
                                if (this.has_vetoed(voted_for[i])) {
                                    result.push(voted_for[i]);
                                }
                            }
                            return result;
                        }
                    }),
            new Actor(draw,
                    {   id:                 'shaft',
                        name:               'Shaft',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_bummable:        true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        shaftee:            '',
                        get_original_destination:    function() {
                            if (draw.actor_by_id['hel'].hell_on_earth == this.id) {
                                return '';
                            }
                            return (this.shaftee == 'kurt' && this.destination) || 
                                   (this.shaftee == 'glogg' && draw.actor_by_id['glogg'].shaft_available() == 'special-glogg' && 
                                    draw.actor_by_id[draw.actor_by_id['glogg'].mascot].get_original_destination()) ||
                                   '';
                        },
                        get_destination:    function() {
                                                return this.get_original_destination();
                        }
                    }),
            new Actor(draw,
                    {   id:                 'grosser',
                        name:               'Grosser Vass',
                        needs_delegate:     true,
                        random_delegate:    true,
                        is_bummable:        true,
                        is_hellable:        true,
                        grosseree:            '',
                        get_original_destination:    function() {
                            if (draw.actor_by_id['hel'].hell_on_earth == this.id) {
                                return '';
                            }
                            return (this.grosseree && draw.actor_by_id[this.grosseree].get_original_destination());
                        },
                        get_destination:    function() {
                                                return this.get_original_destination();
                        }
                    }),
            new Actor(draw,
                    {   id:                 'reardon',
                        name:               'Reardon',
                        winner:             (TEST && 'RW' ) || '',
                        destination:        (TEST && 'Barcelona') || '',
                        runner_up:          (TEST && 'MT' ) || '',
                        helpimede:          (TEST && 'Vienna') || '',
                        is_vetoable:        true,
                        is_bummable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        needs_delegate:true,
                        /* FIXME: I have assumed glogg can bum reardon despite the wiki */
                        get_destination:    function() {
                            return (!this.is_bummed() && !this.is_vetoed() && !this.is_shafted() && this.get_original_destination()) || '';
                        },
                    }),
            new Actor(draw,
                    {   id:                 'louis',
                        name:               'Louis',
                        finalists:          [ (TEST && 'DT' ) || '', (TEST && 'DL' ) || ''],
                        final_judges:       [ (TEST && 'Cheryl' ) || '', (TEST && 'Louis' ) || ''],
                        final_destinations: [ (TEST && 'Vilnius') || '', (TEST && 'Zadar') || ''],
                        is_vetoable:        true,
                        is_bummable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        needs_delegate:true,
                        get_destination:    function() {
                            return (!this.is_bummed() && !this.is_vetoed() && !this.is_shafted() && this.get_original_destination()) || '';
                        },
                    }),
            new Actor(draw,
                    {   id:                 'glogg',
                        name:               'Gløgg',
                        needs_delegate:     true,
                        random_delegate:    true,
                        mascot:             '',
                        action:             '',
                        is_vetoable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        shaft_available:    function() {
                            /* Available if he has bummed a mascot out of their destination, or if he has his own destination */
                            if (this.action == 'bum') {
                                /* TODO: assuming glogg can bum reardon */
                                return (this.mascot == 'lll' || this.mascot == 'reardon' || this.mascot == 'louis') && 'special-glogg';
                            } else {
                                return this.get_original_destination() && 'normal';
                            }
                        },
                        get_original_destination: function() {
                            return (this.mascot == 'lll' && this.action == 'help' && draw.actor_by_id[this.mascot].destination) || 
                                   (this.mascot == 'reardon' && this.action == 'help' && draw.actor_by_id[this.mascot].helpimede) ||
                                   (this.mascot == 'louis' && this.action == 'help' && draw.actor_by_id[this.mascot].helpimede) ||
                                   (this.mascot == 'bourne' && this.action == 'help' && this.destination) ||
                                   (this.mascot == 'hel' && this.action == 'bum' && draw.actor_by_id[this.mascot].in_hell) || '';
                        },
                        get_destination: function() {
                            var orig = this.get_original_destination();
                            return (!this.is_vetoed(orig) && !this.is_shafted() && orig) || '';
                        }
                    }),
            new Actor(draw,
                    {   id:                 'barney',
                        name:               'Barney',
                        diplomat:           '',
                        is_bummable:        true,
                        is_hellable:        true,
                    }),
            new Actor(draw,
                    {   id:                 'dr_wine',
                        name:               'Doctor Wine Picard',
                        pervo:              '',
                        is_hellable:        true
                    }),
            new Actor(draw,
                    {   id:                 'bourne',
                        name:               'P.C. Bourne',
                        is_bummable:        true,
                        is_vetoable:        true,
                        is_shaftable:       true,
                        is_grosserable:     true,
                        is_hellable:        true,
                        get_destination:    function() {
                            return ( !this.is_bummed() &&
                                     (this.get_original_destination() != draw.actor_by_id['hel'].in_hell)
                                     && this.get_original_destination() ) || ''
                        }
                    }),
            new Actor(draw,
                    {   id:                 'hel',
                        name:               'Hel 2006',
                        in_hell:            '',
                        is_bummable:        true,
                    }),
            new Actor(draw,
                    {   id:                 'piparus',
                        name:               'Piparus'
                    }),
            new Actor(draw,
                    {   id:                 'gibbon',
                        name:               'Pete Gibbon',
                        round:              '',
                        needs_delegate:     true,
                        is_hellable:        true,
                        get_destination:    function() {
                            return ((
                                    (this.round == 'kurt' && draw.actor_by_id['kurt'].vetoed_destinations().length >= 1
                                                         && draw.actor_by_id['hel'].hell_on_earth != 'kurt') ||
                                    (this.round == 'shaft' && draw.actor_by_id['shaft'].shaftee
                                                         && !draw.actor_by_id['shaft'].destination
                                                         && draw.actor_by_id['hel'].hell_on_earth != 'shaft') ||
                                    (this.round == 'grosser' && draw.actor_by_id['grosser'].grosseree
                                                         && draw.actor_by_id['hel'].hell_on_earth != 'grosser')
                                   ) && this.get_original_destination()) || '';
                        }
                    }),
            new Actor(draw,
                    {   id:                 'dole',
                        name:               'La Dôle',
                        trappee:            '',
                        is_bummable:        true,
                        is_hellable:        true,
                    }),
            new Actor(draw,
                    {   id:                 'shanaman',
                        name:               'Shanaman'
                    }),
            new Actor(draw,
                    {   id:                 'gozer',
                        name:               'Gozer',
                        is_hellable:        true,
                        needs_delegate:     true,
                    }),
            new Actor(draw,
                    {   id:                 'thorsten',
                        name:               'Thorsten',
                        needs_delegate:     true
                    }),
            new Actor(draw,
                    {   id:                 'm_taylor',
                        name:               'Marco Taylor',
                        is_hellable:        true, /* only insofar as the page then explains why he isn't */
                    }),
    ]};
            
    var Phase = function(draw,obj) {
        this.draw = draw;
        var keys = Object.keys(obj);
        for (var i=0; i<keys.length; i++) {
            this[keys[i]] = obj[keys[i]];
        }
    };

    Phase.prototype = {
        status:         (TEST && 'ready') || 'waiting',
        disabled:       false,
        depends:        null
    }

    var engine = angular.module("draw", [ ]);

    var root_url = "http://www.colourcountry.net/colonel/";

    var get_phases =  function(draw){ 
        /* The order in this list determines the order displayed.
           It's independent of the dependency tree but should make sense */
        return [
            new Phase(draw,
                {   id:             "REARDON",
                    actor:          draw.actor_by_id['reardon']
                }),

            new Phase(draw,
                {   id:             "ENVELOPE",
                    actor:          draw.actor_by_id['gibbon']
                }),

            new Phase(draw,
                {   id:             "PCB_LIST"
                }),

            new Phase(draw,
                {   id:             "PIPARUS",
                    actor:          draw.actor_by_id['piparus']
                }),

            new Phase(draw,
                {   id:             "SHANAMAN",
                    actor:          draw.actor_by_id['shanaman']
                }),

            new Phase(draw,
                {   id:             "MENTALIST",
                    actor:          draw.actor_by_id['bourne'],
                    depends:        ["PCB_LIST","PIPARUS","SHANAMAN"]
                }),

            new Phase(draw,
                {   id:             "HEL_2006",
                    actor:          draw.actor_by_id['hel'],
                    depends:        ["MENTALIST"]
                }),

            new Phase(draw,
                {   id:             "X_FACTOR",
                    actor:          draw.actor_by_id['louis']
                }),

            new Phase(draw,
                {   id:             "SCHWEINE",
                    actor:          draw.actor_by_id['gibbon']
                    /* doesn't depend on envelope as we do it anyway */
                }),

            new Phase(draw,
                {   id:             "APPLY_PG",
                    depends:        ["SCHWEINE","ENVELOPE"],
                    actor:          draw.actor_by_id['gibbon']
                }),
            
            new Phase(draw,
                {   id:             "CONES",
                }),

            new Phase(draw,
                {   id:             "DR_WINE",
                    depends:        ["CONES","X_FACTOR","SCHWEINE"], 
                    actor:          draw.actor_by_id['dr_wine']
                }),

            new Phase(draw,
                {   id:             "TRIBUTE",
                }),

            new Phase(draw,
                {   id:             "FINAL_NT",
                }),

            new Phase(draw,
                {   id:             "MASC_ASS",
                    depends:        ["FINAL_NT"]
                }),

            new Phase(draw,
                {   id:             "REVEAL",
                    depends:        ["FINAL_NT"]
                }),

            new Phase(draw,
                {   id:             "LLL",
                    depends:        ["REVEAL"], 
                    actor:          draw.actor_by_id['lll']
                }),

            new Phase(draw,
                {   id:             "GLOGG",                    
                    depends:        ["MASC_ASS","MENTALIST"],
                    actor:          draw.actor_by_id['glogg']
                }),

            new Phase(draw,
                {   id:             "BARNEY",
                    depends:        ["MASC_ASS"],
                    actor:          draw.actor_by_id['barney']
                }),

            new Phase(draw,
                {   id:             "TRAP_COW",
                    depends:        ["MASC_ASS"],
                    actor:          draw.actor_by_id['dole']
                }),

            new Phase(draw,
                {   id:             "X_WINNER",
                    depends:        ["X_FACTOR"], 
                    actor:          draw.actor_by_id['louis']
                }),

            new Phase(draw,
                {   id:             "KURT",
                    depends:        ["REVEAL","MASC_ASS","LLL","X_WINNER","GLOGG","BARNEY","APPLY_PG"],
                    actor:          draw.actor_by_id['kurt']
                }),

            new Phase(draw,
                {   id:             "SHAFT",
                    depends:        ["FINAL_NT","MASC_ASS","KURT","GLOGG"],
                    actor:          draw.actor_by_id['shaft']
                }),

            new Phase(draw,
                {   id:             "GROSSER",
                    depends:        ["FINAL_NT","MASC_ASS","SHAFT"],
                    actor:          draw.actor_by_id['grosser']
                }),

            new Phase(draw,
                {   id:             "DIPL_BAG",
                    depends:        ["BARNEY"]
                }),

            new Phase(draw,
                {   id:             "COW_BAG",
                    depends:        ["TRAP_COW"]
                }),

            new Phase(draw,
                {   id:             "REH_DRAW",
                    depends:        ["REVEAL","LLL","KURT","SHAFT","DIPL_BAG","TRAP_COW"]
                }),

            new Phase(draw,
                {   id:             "THE_DRAW",
                    depends:        ["REH_DRAW"]
                }),

            new Phase(draw,
                {   id:             "ERIC",
                    depends:        ["THE_DRAW"],
                    actor:          draw.actor_by_id['eric']
                }),

            new Phase(draw,
                {   id:             "M_TAYLOR",
                    depends:        ["ERIC"],
                    actor:          draw.actor_by_id['m_taylor']
                }),

            new Phase(draw,
                {   id:             "MEDALS",
                })

    ]};

    engine.controller("DrawController", function() {
        this.destination = '';
        this.eric_destination = '';
        this.real_destination = '';

        this.actors = get_actors(this);
        this.actor_by_id = {};
        this.human_actors = [];
        this.bummable_actors = [];

        for (var i=0; i<this.actors.length; i++) {
            this.actor_by_id[this.actors[i].id] = this.actors[i];
            if (this.actors[i].is_human) {
                this.human_actors.push(this.actors[i]);
            }
            if (this.actors[i].is_bummable) {
                this.bummable_actors.push(this.actors[i]);
            }
        }

        this.phases = get_phases(this);
        this.phase_by_id = {};

        for (var i=0; i<this.phases.length; i++) {
            if (!this.phases[i].depends) {
                this.phases[i].status = 'ready';
                this.phases[i].depends = [];
            }
            this.phase_by_id[this.phases[i].id] = this.phases[i];
        }

        console.log(Object.keys(this.phase_by_id));

        /* Dynamic list sources */

        this.get_shaft_available_actors = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if (this.actors[i].shaft_available() &&
                   (this.actor_by_id['hel'].hell_on_earth != this.actors[i].id)) {
                    result.push(this.actors[i]);
                }
            }
            return result;
        }

        this.get_grosser_available_actors = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if (this.actors[i].grosser_available() &&
                   (this.actor_by_id['hel'].hell_on_earth != this.actors[i].id)) {
                    result.push(this.actors[i]);
                }
            }
            return result;
        }

        this.get_attendees = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if (this.actors[i].is_attendee) {
                    result.push(this.actors[i]);
                }
            }
            return result;
        }

        this.get_absentees = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if (this.actors[i].is_human && !this.actors[i].is_attendee) {
                    result.push(this.actors[i]);
                }
            }
            return result;
        }

        this.get_hell_on_earth = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if ((this.actors[i].is_human && !this.actors[i].is_attendee) ||
                   (this.actors[i].is_hellable)) {
                    result.push(this.actors[i]);
                }
            }
            return result;
        }

        this.get_destinations = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                var d = this.actors[i].get_destination();
                if (d) {
                    result.push(d);
                }
            }
            return result;
        }

        this.get_destinators = function(exclude) {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                if (exclude && exclude.indexOf(this.actors[i].id) >= 0) {
                    // avoid circular logic if we are using this to choose somebody's destination
                } else {
                    var d = this.actors[i].get_destination();
                    if (d) {
                        result.push( { actor: this.actors[i],
                                       destination: d } );
                    }
                }
            }
            /* FIXME: this causes the '10 $digest() iterations' warning because it always returns a different object.
                      Not an urgent fix because it's only triggered on change of a pretty obscure select */
            return result;
        }

        this.get_mentalists = function() {
            result = [];
            for (var i=0; i<this.actors.length; i++) {
                var d = this.actors[i].get_mentalist();
                if (d) {
                    result.push(d);
                }
            }
            return result;
        }

        /* Actions */

        this.mark_done = function(phase_done) {
            if (phase_done.status == 'done') {
                return; /* already done */
            }
            for (var i=0; i<this.phases.length; i++) {
                if (this.phases[i].id == phase_done.id) {
                    this.phases[i].status = 'done';
                } else {
                    var done_idx = this.phases[i].depends.indexOf(phase_done.id);
                    if (done_idx >= 0) {
                        this.phases[i].depends.splice(done_idx,1);
                        if (this.phases[i].depends.length == 0) {
                            this.phases[i].status = 'ready';
                        }
                    }
                }
            }
        };
    });
})();
