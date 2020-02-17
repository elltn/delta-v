# DELTA V #

For workflow we are using VSCode with the following extensions:
- Live Server (can host the client index.html in browser to dev locally)
- Live Sass Compiler (to automatically compile SCSS into CSS for the live server)
- es6-string-html (highlights HTML in template literals)
- es6-string-javascript (highlights JS in template literals)

## TODO ##
- Make v-component iframe set height based on actual frame dom content

# Next week - Ell #
- Build in real database for Page + Component
- Have dev console actually read / save files to DB


# Bin? #
is_deleted for every item in the DB
automation to check all items older than X days and really delete them


# OOE #
Get original row, with all fields, from database, run through the dictionary
Get client row, merge into a copy of the dictionary old so you have TWO dictionary definitions
// NO Run BEFORE automations with the second DD (Client) (manipulations and shit)
Run data quality rules
Commit to Database

authenticate
permissions
dictionary
(maybe manipulation in future?)
data quality#

# Data Quality Rules # 
all validations


# Automation #
Declarative build the automation
OR you call custom code

Either way that is an automation 'record', and you can set the order

ORIGINAL_DB
ORIGINAL_STATE
COMMIT_DB
CURRENT_STATE

Automation should take in NEW record and CURRENT STATE record from the beginning

same reference of original record through a whole process from UI to commit to after autmation

Automation tester to run record through automation to test automation process before and after
NEST automation

i.e. 

Run 1
Run 2
  Run 3 if 2 PASSES

Let users be able to ROLLBACK to original 

# Admin Tools #
Database Manager + Data Quality Rules
Page Builder
Automation Designer
Design Studio
Developer Console
Instance Manager + Version Control


Integration Builder