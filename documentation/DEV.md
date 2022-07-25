Projekat je realizovan u React.ts sa Mobx storovima.
::: mermaid
 graph TD;
 Store --> Agent
 Agent --> Models 
 Store --> Models
 Layout --> Store
 Layout --> Components
 Layout --> Assets
 Layout --> Models
 Layout --> Features --> Models
 Features --> Assets
 Features --> TypingsCustom
 Features --> Components
 Features --> Common --> Models
 Common --> Components;

click Store "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/223/Store"
click Agent "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/222/Agent"
click Models "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Application"
click Layout "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/224/Layout"
click Components"https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Persistence"
click Assets "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/220/Assets"
click Features "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/221/Features"
click TypingsCustom "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Domain"
click Common "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Spa/218/Common"
click Components "https://dev.azure.com/3MPOS/Ekviti/_wiki/wikis/Api/189/Domain"
:::


