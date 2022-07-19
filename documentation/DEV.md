Projekat je konstruisan kao REST API u .net Core 3.1 frejmwrku.
::: mermaid
 graph TD;
 Agent --> Models 
 Agent --> Store --> Models
 Store --> Layout --> Components
 Layout --> Assets
 Layout --> Models
 Layout --> Features --> Models
 Features --> Assets
 Features --> Components
 Features --> Common --> Models
 Common --> Components;

click API "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/API"
click Infrastructure "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/190/Infrastructure"
click Application "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Application"
click DAL "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/DAL"
click Persistence "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Persistence"
click Domain "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Domain"
:::


