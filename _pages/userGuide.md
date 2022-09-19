---
title: How to use
permalink: /userGuide/
layout: single
toc: true
toc_label: "On this page"
toc_sticky: true
---

{% include figure image_path="assets/images/augCom.png" alt="Augcom" %}

# The Keyboard

Augcom's keyboard allows you to generate sentences using the pictograms proposed on a grid. 
There are two kinds of keys on Augcom's keyboard, the simple keys, which allow you to add a word to the sentence, and the "folder" keys, which will allow you to enter the corresponding folder to discover a new pictograms grid.

{% include figure image_path="assets/images/menu_bar_closed.PNG" alt="menu bar" %}

When you enter a folder, you can go back to the previous page by using the back arrow located at the bottom left of the window.

To the right of the back button you will find the path you followed to get to your current page.

The button with a padlock at the bottom right allows you to unlock access to several Augcom features that are hidden by default so as not to distract the user's view. 

# The Text Bar 

When a simple button is activated, the word and its pictogram are added to the sentence, in the grey text bar that is visible below.

{% include figure image_path="assets/images/text_bar.PNG" alt="text bar" %}

The button directly to the right of the text bar is the "read" button. It allows you to pronounce the sentence in its entirety, thanks to the speech synthesis.

The next button, with a "T", is the button that allows you to directly enter a text with the traditional keyboard and to add it to the sentence. This button can be useful for example if a word is missing in the grid.

The button with a left arrow allows to delete the last word added to the sentence.

The second to last button, with a cross, is used to delete the whole sentence.

The rightmost button, in the form of a question mark, displays the help menu.

# The Menu Bar 

{% include figure image_path="assets/images/menu_bar_open.PNG" alt="menu bar open" %}

Once you have unlocked the list of features with the locked button at the bottom right of the program, you will have access to a menu bar.

The button with a flag allows you to change the language of the application, for the moment only two languages are available: French and English. *(Note: this button allows you to change the language of the menu only, it will not change the language of the grid.)

The button with the cross at the ends in the form of an arrow allows you to switch to full screen mode. *(Note: the full screen mode is not available on IOS i.e. Iphone, Ipad, etc...)*

The eye button allows you to show or hide the elements marked as "not visible" with this feature. *For more information see the "Button Modifications" section.

## Button Modifications

The pencil button activates the "edit" mode of the grid.

In "edition" mode, several functionalities are available, they appear in the new bar above the grid.

{% include figure image_path="assets/images/grid_bar.PNG" alt="grid bar" %}

The first button, with blue edges, allows you to select or deselect all buttons in the current grid.

The button with a pencil allows you to change all the currently selected buttons at once.

The third button, with a trash can icon, allows you to delete all the currently selected buttons. *(Note: a validation request will be displayed to avoid a false manipulation.)

On the right side of the bar you will find text zones that can be modified with the keyboard or with the small arrows that appear when you hover over them.

The first text zone defines the number of columns in the current grid.
The second zone allows you to define the number of rows in the current grid.
The last one allows to define the distance between the keys of the current grid.

In "edit" mode, for each key, three new buttons appear in the corners as you can see below.

{% include figure image_path="assets/images/button_edit_mode.PNG" alt="button edit mode" %}

- The red button with a trash can allows you to delete the button it is attached to. *(Note: a validation request will be displayed to avoid a false manipulation.)
- The button with an eye allows you to mark it as "not visible" when the function with the eye is activated using the function presented in the "Menu bar" section.
- The arrow cross at the bottom right allows you to move the button to another location on the grid. *Press and hold to grab the button and lift it, then move it around the grid and release the button to accept the new position.
- You can also stretch the key, in height or width, by dragging its edges.

By clicking once on a key you can select/deselect it and then click on the buttons of the edit mode feature bar presented just before, to modify or delete all the selected keys.

To modify a single key, you just have to double click on it, the editing page will then open.
At the bottom of the grid, above the features bar, an "add" button also allows you to add a new button, the editing page will then open.
*For more information on the editing page, see the section "Editing page: creating and modifying a button".

Finally the gear wheel allows you to access the more advanced settings of the software. *For more information on this topic, please refer to the section "Application Settings".

# Grid generator

## Unlock options

Start by unlocking the options by clicking on the nut with a lock.

{% include figure image_path="assets/tuto/unlockSettings.png" alt="unlockSettings" %}

## Activate the editing mode

Next, you need to activate the edit mode to bring up the Generate Grid button.
{% include figure image_path="assets/tuto/modeEdition.png" alt="modeEdition" %}

## Press the grid generation button

Press the grid generation button at the top of the screen.
{% include figure image_path="assets/tuto/buttonGenerateGrid.png" alt="buttonGenerateGrid" %}

## Fill in the fields

Once in the grid generation menu, you have to fill in all the fields according to what you want to have in your grid.
{% include figure image_path="assets/tuto/fillChampsEN.png" alt="fillChampsEN" %}

## Possible error messages
During this step, it is possible to have several errors. The error message that will appear corresponds to the first error encountered, so once you have corrected it, if there are others, they will appear each time you press the "Generate" button.
{% include figure image_path="src/assets/tuto/erreurEN.png" alt="erreurEN" %}
For each of the fields, you can with errors, here are some :
- "No name for the grid! -> here you have to fill in the first field which gives the name to the grid
- "No columns" -> here you have to fill in the second field, indicate a number for the number of columns
- "No lines" -> here you have to fill in the third field, indicate a number for the number of lines
- "Empty word list" -> here you have to fill in the fourth field, indicating words separated by a space for the list example: "apple banana"

## Result

{% include figure image_path="assets/tuto/resultEN.png" alt="resultEN" %}

# Edit page: creation and modification of keys

## Information menu

{% include figure image_path="assets/images/edition_page.PNG" alt="edition_page" %}

The information menu allows you to modify the basic information of the key.

You can change its name.
But you can also change its "type", you can choose between a "simple" key or a "folder" key (or "directory").

{% include figure image_path="assets/images/change_type_button.PNG" alt="change_type_button" %}

If the "folder" radio button is selected, a drop-down menu appears, to choose the existing page to which the menu links or to create a new page.
If you choose to create a new page a text box appears to define the identifier (name) of the page that will be created.

{% include figure image_path="assets/images/add_a_new_page.PNG" alt="add a new page" %}

## Appearance menu

### change colors

The appearance menu allows you to change the graphic elements of a key.

{% include figure image_path="assets/images/edition_color_modif.PNG" alt="edit color modif" %}

The inner and outer color of the button can be modified using user-defined palettes. *(To learn how to manage the palettes, go to the "Palette Management" section.)

### modify the image / pictogram

For image modification, 3 possibilities are available.

{% include figure image_path="assets/images/modifier_l_image.PNG" alt="modify image" %}

- You can first import one of your own image files by clicking on "choose a file".
- You can also import an image from a URL. To do this, simply enter the URL in the corresponding text box and click OK.
- Finally you can add an image from our local library of images from several open source databases. To find the image you are interested in, enter the keyword in the corresponding text box and click on "search". Several pictograms will be proposed to you, just click on the one that suits you.

{% include figure image_path="assets/images/library_fruit_search.PNG" alt="library fruit search" %}

For each of the previous changes, either for the image or the color, a preview of the button is available in the upper right, allowing you to see the changes you made.

{% include figure image_path="assets/images/saved_changes.PNG" alt="saved changes" %}

## Other Shapes Menu

Here you can add alternative forms to your word, alternative forms can be useful to add a masculine/feminine/plural version to an existing word or conjugations for a verb.
To add a new alternate form of the word click on the add button.

{% include figure image_path="assets/images/add_variant.PNG" alt="add variant" %}

You can add a variant in two different ways.
- Either manually, by choosing the word that will be displayed and the one that will be pronounced.
- Or by searching the existing variants for this word from the net. **(this feature is currently under development and is not yet functional.)

{% include figure image_path="assets/images/variant_informations.PNG" alt="variant information" %}

For each variant you can also choose the image that will be displayed for that variant in the same way as when you choose an image for the initial key.

To delete a previously created variant, click on the red button with a trash can on the variant in question.

{% include figure image_path="assets/images/variant_fruit_saved.PNG" alt="variant fruit saved" %}

## Interaction menu

The interaction menu allows you to define the actions that will be done for each of the three interactions (single click, long press and double click).
By default a single click adds the word to the sentence and speaks it.

{% include figure image_path="assets/images/interactions.PNG" alt="interactions" %}



To add an action, click on the small "+" at the bottom of the column corresponding to the interaction you want to modify.

{% include figure image_path="assets/images/scroll_menu_interactions.PNG" alt="scroll menu interactions" %}

The different sound actions:

 - *add to phrase*: adds the word to the text box.
 - pronounce*: pronounces the word via the speech synthesis.
 - back*: returns to the previous page.
 - return to the main screen*: returns to the home page of your keyboard.
 - show alternative forms*: shows the alternative forms of the button if it has any. *(for more information about alternative forms, go to the corresponding section)*
 

# Application settings

## Application

### Application theme

In this section you can change the general look of the application by selecting 4 colors of your choice and the font of the application menus.
{% include figure image_path="assets/images/color_and_text_normal.PNG" alt="color_and_text_normal" %}
{% include figure image_path="assets/images/color_and_text changed.PNG" alt="color_and_text changed" %}

### Palette management

Here you can add or create your own color palettes.
To delete a palette simply click on the trash can icon to the right of it.

To add a palette click on "new palette", new buttons will appear.
The "+" button allows you to add a color, you can click on the added color to modify it to your liking. 
You can delete the added color by clicking on the cross at the top right of the color. 
To validate your palette click on save. If you want to cancel the creation of your palette click on the trash can icon.

### Interactions

In the interactions section you can define the duration for each interaction.
You can define the pressure time to cause a "long press" (in ms)
You can define the maximum distance between two clicks so that they are considered as a double click.
You can also activate the fixation time, with which you only have to look at an element to provoke a click.
and you can set the length of time it takes for this fixation to cause a click.

### Language

In Language you can choose the voice output you prefer from a list of voices. (the voices depend on your computer and browser).

You can also select the default language of the application.

### Share

Here you can export the backup of a grid you have created.

You can also import an old backup.

You can also export your current grid in PDF format.

TD Snap Core First file import allows you to import SPB backup files given by the TD Snap Core First application.

## Grids

### Page Title

Allows you to choose the display type of the path to your current page.
By default the image of your current page and the path to it will be displayed. You can choose to display only one of these two informations.

You can also choose to change the format of the title by displaying only the name of the page rather than the path to it.

### Grid format

Here you can define the default dimensions of your grid (number of columns, rows and distance between pictograms). These dimensions will only be applied to pages for which you have not yet manually modified the dimensions via the edit mode of the main screen.

You can also choose the color of the background behind your pictograms.

## Pictograms

### Pictogram Style

Here you can define the style of the two button formats, simple buttons and folder buttons (or pictograms and directory pictograms).
For each of these two types of buttons you can choose to display the image and the text of the button or only one of the two values, you can also choose the disposition of the text in relation to the image (bottom, top, left or right).
Finally you can choose the font of the text contained in this button
