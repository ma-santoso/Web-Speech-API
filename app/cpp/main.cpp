#include "include/document.h"
#include "include/filewritestream.h"
#include "include/prettywriter.h"
#include "include/stringbuffer.h"
#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

using namespace rapidjson;
using namespace std;

// send the first 32-bit message
void precedent (unsigned int len) {
    cout << char(len>>0) << char(len>>8) << char(len>>16) << char(len>>24);
}

// send the message in json format
void sendMessage (string message) {
    string jsonMessage = "{\"text\":\"" + message + "\"}";
    unsigned int len = jsonMessage.length();
    precedent(len);
    cout << jsonMessage;
}

// get the first word in the message
string getPrelude (string text) {
    string prelude;
    if (text.substr(9,5) == "entry")
        prelude = "entry";
    else if (text.substr(9,6) == "launch")
        prelude = "launch";
    return prelude;
}

// get an entry length
int getEntry (string text) {
    size_t len = text.length();                 // get length of the message
    size_t sz;
    string sn = text.substr(16,len-18);         // get the number in string
    int in = stoi (sn,&sz);                     // convert that string into integer
    return in;                                  // return the integer
}

// get an app name to launch
string getAppName (string text) {
    size_t len = text.length();
    return text.substr(16,len-18);
}

// main
int main() {
    const char* keyName = "name";
    const char* keyAlias = "alias";
    const char* keyProgram = "program";
    vector<string> appName, appAlias, appProgram;
    vector<const char*> pName, pAlias, pProgram;
    StringBuffer json;
    PrettyWriter<StringBuffer> writer(json);

    while (1) {
        unsigned int length = 0;
        string msg = "";

        for (int i = 0; i < 4; i++) {
            unsigned int read_char = getchar();             // read the first 32-bit
            length = length | (read_char << i*8);
        }

        for (int i = 0; i < length; i++) {
            msg += getchar();                               // read the json-message
        }

        if (msg == "{\"text\":\"#STOP#\"}") {               // check if #STOP# signal is sent
            sendMessage("EXITING...");                      // output message
            break;
        }
        else if (getPrelude(msg) == "launch" ) {            // check if the launch message is given
            string appToLaunch = getAppName(msg);           // get the app name
            const char* appToLaunchC = appToLaunch.c_str(); // convert it to const char*
            system(appToLaunchC);                           // launch it
            break;
        }
        else if (getPrelude(msg) == "entry") {              // check if the entry message is given
            int entry = getEntry(msg);                      // find out how many entry are there
            while (entry != 0) {
                size_t locName, locProgram, locEnd;
                string appMsg, name, alias, program;
                unsigned int appLen = 0;

                for (int i = 0; i < 4; i++) {
                    unsigned int read_char = getchar();
                    appLen = appLen | (read_char << i*8);
                }
                appMsg = "";
                for (int i = 0; i < appLen; i++) {
                    appMsg += getchar();
                }
                locName = appMsg.find("name");                                 // find the location of 'name'
                locProgram = appMsg.find("program");                           // find the location of 'program'
                locEnd = appMsg.find("}");                                     // find where the string ends
                name = appMsg.substr(locName+5,locProgram-locName-6);          // get the value of name
                alias = name.substr(0,name.find(" "));                         // get the value of alias
                program = appMsg.substr(locProgram+8,locEnd-locProgram-9);     // get the value of program

                appName.push_back(name);                                       // push the name value into the array
                appAlias.push_back(alias);                                     // push the alias value into the array
                appProgram.push_back(program);                                 // push the program value into the array
                entry--;                                                       // decrement loop
            }
            for (int i = 0; i < appName.size(); i++) {
                const char* cName = appName[i].c_str();                        // convert string into const chars
                const char* cAlias = appAlias[i].c_str();
                const char* cProgram = appProgram[i].c_str();
                pName.push_back(cName);                                        // push them into new array
                pAlias.push_back(cAlias);
                pProgram.push_back(cProgram);
            }
            for (int i = 0; i < appName.size(); i++) {
                string msgName = string(keyName) + ": " + string(pName[i]) + ", " + string(keyAlias) + ": " + string(pAlias[i]) + ", " + string(keyProgram) + ": " + string(pProgram[i]);
                sendMessage(msgName);
            }
            writer.StartObject();                                              // initiating writing json format
                writer.Key("appList");
                writer.StartArray();
                    for (int i = 0; i < appName.size(); i++) {
                        writer.StartObject();
                            writer.Key(keyName);
                            writer.String(pName[i]);
                            writer.Key(keyAlias);
                            writer.String(pAlias[i]);
                            writer.Key(keyProgram);
                            writer.String(pProgram[i]);
                        writer.EndObject();
                    }
                writer.EndArray();
            writer.EndObject();                                                // finishing writing json format
        }

        Document doc;
        doc.Parse(json.GetString());

        FILE* file = fopen("json/appList.json", "w");                          // locate json file to write
        char writeBuffer[65536];
        FileWriteStream os(file, writeBuffer, sizeof(writeBuffer));
        Writer<FileWriteStream> saver(os);
        doc.Accept(saver);
        fclose(file);

        unsigned int len = length;
        precedent(len);
        cout << msg << flush;                                                  // flush stream buffer
    }

    return 0;
}
