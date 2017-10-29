# Messenja

Messenja est un framework qui permet de simplifier la création de bot sur Facebook Messenger et Telegram ainsi que prochainement Slack.

Il est composé de deux parties :

- `request` qui traite la requête envoyée par un utilisateur à travers une app de messagerie pour la mettre dans un format standard, indépendant de l'app utilisée
- `response` qui permet d'envoyer des messages de différents types (texte, image, location...) à un utilisateur à travers l'app de messagerie

## Pré-requis

- Un serveur avec une URL en **https** accessible depuis Internet
- Un token pour chaque service que vous voulez utiliser (voir **Configuration**)
- NodeJS >= 7.0

## Configuration

### Telegram

1. [Obtenir un token pour Telegram avec BotFather](https://telegram.me/BotFather)
2. [Lier son serveur avec un bot Telegram par webhook](https://core.telegram.org/bots/webhooks)

### Facebook Messenger

- [Créer une app Facebook Messenger et obtenir un token](https://developers.facebook.com/docs/messenger-platform/guides/quick-start)

## Utilisation

1. Installer Messenja : `npm i --save messenja`
2. Compléter la configuration dans un fichier `config.json` (à partir de `config.json.example`)
3. Créer votre application

```javascript
import messenja from 'messenja';
messenja((request, response) => {
  response.sendText(`Salut *${request.user}* !`);
  response.sendImage('https://example.com/hello.png');
});
```

## Request
`request` contient les données reçues du service dans un format standard.

```json
{
  "user_id": "number",
  "chat_id": "number",
  "user": "string",
  "date": "number",
  "service": "string",
  "isCallback": "boolean",
  "content": {
    "text" : "string",
    "image": "url",
    "video": "url",
    "location": {
      "latitude": "number",
      "longitude": "number"}
  }
}
```
### Contenu

Si le type de requête de l'utilisateur est supporté par Messenja, le champ content contient les données sous la forme:

```Json
{
  ...
  "content": {
    "TYPE": DATA
	}
}
```

Si le type de requête n'est pas reconnu, Messenja retourne un champ `raw` avec les données reçues non traitées à la place du champ `content`.

### Callback

Lorsqu'un utilisateur clique sur un bouton avec une `value` associée, le serveur reçoit une requête de type *callback*. Il est ainsi possible de différencier les messages standards des messages de callback de cette manière :

```javascript
if (request.isCallback) response.sendText(`Vous avez cliqué sur un bouton : ${request.data}`);
else response.sendText('Hey ! Que choisis-tu ?', keyboard);
```

Dans ce cas, le champ `content` est remplacé par un champ `data` contenant la valeur associée au bouton.

### Dialogflow

Il est possible de lier votre application à un agent sur [Dialogflow](https://dialogflow.com/). Pour cela, il suffit de fournir le *Client access token* de l'agent dans le fichier `config.json`. Si Messenja trouve un token, il ajoutera la réponse de Dialogflow à chacune des requêtes de type texte dans le champ `content` :

```Json
{
  ...
  "content": {
    "text": "Hey !",
  	"dialogflow": DATA Dialogflow
	}
}
```

## Response

`response` permet de communiquer facilement avec l'API des services. Messenja reconnaît automatiquement quelle API utilisée en fonction de la requête de l'utilisateur. Ainsi, on utilise toujours la même interface sans se préoccuper d'un service de messagerie spécifique.

### sendText (text, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `text`     | `string` | Oui    | Texte à envoyer (max: 640 carac.)        |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

> Facebook Messenger et Telegram formatent automatiquement certaines chaînes de caractères selon le balisage Markdown.

### sendImage (urlOrId, text, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `urlOrId`  | `string` | Oui    | URL de l'image à envoyer ou un identifant de fichier Telegram (jpg, png ou gif) |
| `text`     | `string` | Non    | Texte à envoyer (max: 200 carac.)        |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

Si le paramètre `urlOrId` est un identifiant de fichier Telegram, l'image sera téléchargée localement (dans le dossier `cache`) et servie par Messenja dans le cas où on utilise Facebook Messenger.

### sendVideo (urlOrId, text, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `urlOrId`  | `string` | Oui    | URL de la vidéo à envoyer ou un identifant de fichier Telegram (mp4, max: 50MB) |
| `text`     | `string` | Non    | Texte à envoyer (max: 200 carac.)        |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

Si le paramètre `urlOrId` est un identifiant de fichier Telegram, la vidéo sera téléchargée localement (dans le dossier `cache`) et servie par Messenja dans le cas où on utilise Facebook Messenger.

### sendFile (urlOrId, text, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `urlOrId`  | `string` | Oui    | URL du fichier à envoyer ou un identifant de fichier Telegram (max: 50MB) |
| `text`     | `string` | Non    | Texte à envoyer                          |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

Si le paramètre `urlOrId` est un identifiant de fichier Telegram, le fichier sera téléchargé localement (dans le dossier `cache`) et servie par Messenja dans le cas où on utilise Facebook Messenger.

### sendAudio (urlOrId, text, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `urlOrId`  | `string` | Oui    | URL du fichier audio à envoyer ou un identifant de fichier Telegram (mp3, max: 50MB) |
| `text`     | `string` | Non    | Texte à envoyer                          |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

Si le paramètre `urlOrId` est un identifiant de fichier Telegram, le fichier audio sera téléchargé localement (dans le dossier `cache`) et servie par Messenja dans le cas où on utilise Facebook Messenger.

### sendLocation (latLng, keyboard)

| Paramètre  | Type     | Requis | Description                              |
| ---------- | -------- | ------ | ---------------------------------------- |
| `latLng`   | `object` | Oui    | Coordonnées à envoyer au format `{latitude: number, longitude: number}` |
| `keyboard` | `object` | Non    | Clavier pour réponses rapides (voir plus bas) |

### sendWait ()

Indique à l'utilisateur qu'il faut attendre. Cela est utile si on doit réaliser une action qui prend un peu de temps avant de répondre à l'utilisateur.

### sendRaw (rawData, methodTelegram)

Cela permet d'utiliser des fonctionnalités spécifiques à certains services de messagerie comme par exemple, les carrousels et les listes sur Facebook Messenger.

| Paramètre        | Type     | Requis                 | Description                              |
| ---------------- | -------- | ---------------------- | ---------------------------------------- |
| `rawData`        | `object` | Oui                    | Données brutes pour un service spécifique |
| `methodTelegram` | `string` | Seulement sur Telegram | Endpoint (méthode) sur lequel envoyer les données pour le service Telegram |

L'ID du chat / de l'utilisateur est automatiquement ajouté à la requête. Il n'est donc pas nécessaire de préciser le `recipient` sur Facebook Messenger ou le `chat_id` sur Telegram.

> Pour Facebook Messenger, les `rawData` sont ajoutées au champ `message`.

### Keyboard

Il y a deux type de "claviers".

#### Inline
Avec un clavier inline, les boutons sont placés près du texte associé. Les boutons peuvent envoyer une valeur de retour (callback) ou ouvrir une URL. Cela correspond aux réponses rapides.

```json
{
  "keyboard": {
    "inline" : [
      { "label": "Btn 1", "url": "http://5ika.org" },
      { "label": "Btn 2", "value": "CALLBACK_VALUE" },
      { "label": "Btn3"}
    ]
  }
}
```
> Le nombre de boutons est limité à 3 sur Facebook Messenger. Les labels sont limités à 20 caractères.

####  Keyboard

Avec ce type de clavier, les boutons sont proches du clavier standard ou le remplace. Les boutons peuvent renvoyer une géo-localisation ou un texte.

```json
{
  "keyboard" : {
    "keyboard": [
      { "label": "Send location", "location": true },
      { "label": "Key 2" }]
  }
}
```
> Le nombre de boutons est limité à 11 sur Facebook Messenger. Les labels sont limités à 20 caractères.

## Utilitaires

La fonction donnée en paramètre au module `messenja` obtient un troisième object en paramètre, en plus de `request` et `response`. Cette object contient des fonctions utiles spécifiques à un service.

```javascript
messenja((request, response, utils) => {
  utils.getFacebookProfile(FB_ID).then(user => console.log(user));
  utils.getTelegramURL(file_id).then(url => console.log(url));
})
```

### getFacebookProfile (ID)

| Paramètre | Type     | Requis | Description                              |
| --------- | -------- | ------ | ---------------------------------------- |
| `ID`      | `string` | Oui    | Identifiant d'un utilisateur Facebook (`request.user`) |

La fonction retourne un objet contenant les informations Facebook de l'utilisateur sous forme de Promise.

```json
{
   "first_name": "John",
   "last_name": "Doe",
   "profile_pic": "<url>",
   "locale": "fr_FR",
   "timezone": 2,
   "gender": "male",
   "id": "<id>"
}
```

### getTelegramURL (ID)

| Paramètre | Type     | Requis | Description                              |
| --------- | -------- | ------ | ---------------------------------------- |
| `ID`      | `string` | Oui    | Identifiant de fichier Telegram (`file_id`) |

La fonction télécharge le fichier correspondant depuis les serveurs de Telegram puis le sert sur l'URL retournée sous forme de Promise.

## App Express

Il est également possible d'ajouter des routes au serveur Express. Le module `messenja` retourne l'application Express utilisée pour créer les endpoints.

```javascript
const app = messenja((request, response) => {
    // Bot logic
});

app.get('/hello', (req, res) => {
    res.send("Hello !");
});
```

# Todo

- Commenter le code
- Itérer les `entries` et `messaging `pour Facebook Messenger pour ne pas rater des messages en cas de ralentissement du service Facebook.
