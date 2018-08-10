// monitor_newfile.cpp  
// compile script: cl monitor_newfile.cpp /clr /Fe"watcher.exe"
#using <system.dll>  
  
using namespace System;  
using namespace System::IO;  
  
ref class FSEventHandler  
{  
public:  
    void OnChanged (Object^ source, FileSystemEventArgs^ e)  
    {  
        Console::WriteLine(e->FullPath);  
    }
};  
  
int main()  
{  
   array<String^>^ args = Environment::GetCommandLineArgs();  
  
   if(args->Length < 3)  
   {  
      Console::WriteLine("Usage: watcher.exe <directory> <filename>");  
      return -1;  
   }  
  
   FileSystemWatcher^ fsWatcher = gcnew FileSystemWatcher( );  
   fsWatcher->Path = args[1];
   fsWatcher->NotifyFilter = static_cast<NotifyFilters>   
              (NotifyFilters::FileName |   
               NotifyFilters::Attributes |   
               NotifyFilters::LastAccess |   
               NotifyFilters::LastWrite |   
               NotifyFilters::Security |   
               NotifyFilters::Size );  
   fsWatcher->Filter = args[2];
    FSEventHandler^ handler = gcnew FSEventHandler();
    fsWatcher->Created += gcnew FileSystemEventHandler(   
            handler, &FSEventHandler::OnChanged);
    fsWatcher->EnableRaisingEvents = true;
    fsWatcher->IncludeSubdirectories = true;
    Console::ReadLine( );  
}