# Banco de Solidaridad
Web de El Banco de Solidaridad (BdS).

## index.html
Contenido de la web:

##### head
Contiene el título, metatags (seo), carga los estilos y el favicon (imagen mostrada en la barra de navegación).

##### body
Contiene la información.

###### header
Logo y enlaces del menú.
- Se adapta a las pantallas, mostrandose en una *"hamburguesa"* en dispositivos móviles.

###### hero
Información inicial de presentación.

###### main
Secciones de la web, divididas por `<section>...</section>`.

###### footer
Información final con el logo y enlaces de nuevo.

## assets
Contiene las imágenes, estilos css y código javascript.

##### configuration.js
Archivo de configuración donde cambiar los datos generales del Banco de Solidaridad.

##### main.js
Funciones generales útiles (no tocar).

### css
Estilos y colores de la web.

### img
Imágenes utilizadas.

### js
Código que gestiona las partes dinámicas y animaciones de la web.

## Instagram en Noticias (GitHub Actions)
La sección `Noticias` muestra los 3 últimos posts de Instagram desde `assets/data/instagram-posts.json`.

Ese JSON se actualiza automáticamente con el workflow:
`/.github/workflows/update-instagram-news.yml`

### Configuración necesaria en GitHub
`Settings > Secrets and variables > Actions`, contiene estos secretos del repositorio:
1. `INSTAGRAM_ACCESS_TOKEN`
2. `INSTAGRAM_USER_ID`

El workflow ejecuta `scripts/get-instagram-posts.mjs`, genera el JSON y actualiza automáticamente si hay cambios.

### meta.jpg
Imagen *metatag* mostrada al compartir el enlace.

# Hacer cambios
Para realizar cambios, debes pulsar en el botón de **Editar** el archivo que quieras.

Por ejemplo, vamos a editar un texto del `index.html`:
1. Pulsar en `index.html` para acceder al archivo:
<img height="600" alt="image" src="https://github.com/user-attachments/assets/43167261-8837-460a-a645-cd45b11bf513" />

2. Pulsar en `Edit this file`:
<img height="240" alt="edit_file" src="https://github.com/user-attachments/assets/f2ed7667-af7f-4c8f-90ba-a644a00f25a2" />

3. Realizar los cambios que necesites (tranquila que hay historial de versiones).

4. Pulsar en <img height="30" alt="image" src="https://github.com/user-attachments/assets/f424554b-c0ef-48d0-aebb-aa6ff1fd50e6" />

5. Guardar y publicar los cambios confirmando **Commit changes**:
<img height="1008" alt="image" src="https://github.com/user-attachments/assets/c60d33dc-3871-4cb8-acc3-e5c57b16be87" />

6. Los cambios se autopublican, tardan poco (~1min).


# Revertir cambios ante desastre (la web no funciona)
¿Y si la lio? No pasa nada, ¡hay histórico de cambios!

1. Acceder al **Histórico de cambios** (`Commits`):
<img width="1758" height="90" alt="image" src="https://github.com/user-attachments/assets/286ebeea-dd6d-4afd-a2d0-539059c1f1a2" />

2. Pulsar en **Browse repository at this point** (`Acceder al repositorio en este punto`):
<img width="2570" height="404" alt="image" src="https://github.com/user-attachments/assets/d8ef58fd-74fd-4dae-a67b-114fea79a818" />

3. Copiar el contenido que había en ese punto:
<img width="2210" height="430" alt="image" src="https://github.com/user-attachments/assets/7ea1b44f-c71a-41e6-b7e1-e141df59dd56" />

4. Volver al repositorio:
<img width="1610" height="320" alt="image" src="https://github.com/user-attachments/assets/3d9d085a-7b73-40eb-b097-a9fb4a9abc28" />

5. Y pulsar en `index.html` para acceder al archivo con su contenido actual:
<img height="600" alt="image" src="https://github.com/user-attachments/assets/43167261-8837-460a-a645-cd45b11bf513" />

6. Pulsar en `Edit this file`:
<img height="240" alt="edit_file" src="https://github.com/user-attachments/assets/f2ed7667-af7f-4c8f-90ba-a644a00f25a2" />

7. Seleccionar todo el contenido actual con `Ctrl+A`:
<img width="2208" height="828" alt="image" src="https://github.com/user-attachments/assets/6eab0360-b8ce-4ae7-a854-ddacd65ed932" />

8. Eliminar el contenido:
<img width="2206" height="390" alt="image" src="https://github.com/user-attachments/assets/f22bc209-8d94-411f-80d1-8bb6f9b68f35" />

9. Pulsar `Cntrl+V` para pegar el contenido que teníamos copiado con `Copy raw file`:
<img width="2202" height="628" alt="image" src="https://github.com/user-attachments/assets/46fa0f92-22f4-418c-86b9-cdb67a6e9f4b" />

10. `Commit changes` para actualizar el contenido actual con el que había en el punto anterior. 
