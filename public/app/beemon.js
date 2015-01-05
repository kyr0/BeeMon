// global app object
window.Beemon = {

    launch: function() {

        this.renderNavigationUI();
    },

    renderNavigationUI: function() {

        $('.navbar li').click(this.onNavigationMenuClick);
    },

    /**
     * Highlight the currently active
     * @param clickEvent
     */
    onNavigationMenuClick: function(clickEvent) {

        // in-activate menu item highlighting
        $('.navbar li').each(function(index, menuItem) {

            if ($(menuItem).hasClass('active')) {
                $(menuItem).removeClass('active');
            }
        });

        // highlight the currently active menu item
        $(clickEvent.currentTarget).addClass('active');
    }
};

Beemon.launch();