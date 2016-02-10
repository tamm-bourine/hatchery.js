# Hatchery.js

`Hatchery.js`는 `iframe` 생성과 `iframe`간의 통신을 제공하는 경량 라이브러리 입니다.

## Introduce

간혹 우리가 개발을 하다보면 외부와의 격리를 위해 `iframe`을 사용하는 경우가 있습니다. 하지만 동일한 도메인이 아니라면 `XSS`에 관한 위협이나 브라우저 벤더들의 정책에 의해 `window.postMessage` API를 사용해서만 외부와 통신할 수 있습니다.

만약 여러분이 한 개 정도의 `iframe`을 관리한다면 큰 문제가 되지 않겠지만 문제는 페이지 내에 이러한 위젯들이 늘어난다면 어떨까요? 게다가 각 위젯끼리 통신 해야하는 일이 생긴다면..? 물론 이런 경우는 거의 없을 것 입니다. 하지만 여러분이 `Third-party Application`을 개발하고 있다면 이런 상황이 발생하지 않으리란 보장이 없죠.(네, 제가 그렇습니다. 사실)

그래서 저는 `Hatchery.js`를 만들게 되었습니다. `부모 - 자식`간의 통신만이 아니라 부모를 프록시로 사용해 `자식 - 자식` 간의 통신도 제공합니다. 아주 간단한 구현체이기 때문에 소스코드를 보시면 쉽게 이해하실 수 있을 것이라 생각합니다.

## Example

### 1. Init

`Hatchery.js`를 사용하기 위해서는 먼저 각 페이지(`iframe`)에서 초기화 작업이 필요합니다. `messages`는 전달받을 메세지를(메서드) 설정하는 부분으로 초기화 시 설정하지 않고 아래 `setTelepathy` 부분에서 설정 가능합니다.

`url`은 `window.postMessage` 요청 시 검증할 `URL` 입니다. `*`로 설정하게 되면 `origin`을 체크하지 않지만 되도록이면 `URL`을 명시해주세요.

```
Hatchery.init({
	messages: {},
	url: '*' // Set origin
});
```

### 2. Spawn

`Spawn`은 새로운 `iframe`을 생성하는 일을 합니다. 

첫 번째 인자는 `iframe`을 삽입할 컨테이너를 명시해주게 되어있습니다. 두 번째 `cssText`는 생성할 `iframe`에 들어갈 `cssText` 입니다. 생략하게 되면 `Hatchery.js`에서 제공하는 기본 `CSS`가 삽입되게 됩니다. 세 번째 `id`는 생성할 `iframe`의 `id` 입니다. 마지막 `URL`은 `iframe`의 `baseUrl`이겠죠?

여러 개의 `iframe`을 `Spawn`을 통해 만들 수 있습니다만 `id`는 중복되지 않게 해주세요!


```
Hatchery.spawn('#container', {
	cssText: 'min-width:100%;height:100px;overflow:hidden;border:0;',
	id: 'childA', // require
	url: 'YOUR_URL/test/child-a.html' // require
});
```

### 3. Set telepathy

`setTelepathy`는 `부모`나 다른 `자식`들이 보내는 메세지를 받기 위해 설정하는 `이벤트 핸들러` 입니다. 첫 번째 인자는 누구로부터 메세지를 받을지 설정하는 부분입니다. 만약 `childA`라는 `id`를 가진 `iframe`으로 부터 메세지를 받는다면 아래와 같이 설정해주시면 되요!

두 번째 인자는 메세지의 종류을(함수 명) 설정하는 부분입니다. 마지막은 메세지를 전달받을 함수를 설정해주시면 됩니다. 이 때 2개의 파라메터가 넘어오는데 첫 번째는 메세지를 보낸 `iframe`의 `id`, 두 번째는 실제 데이터가 넘어오게 됩니다.

```
Hatchery.setTelepathy('childA', 'init', function(sender, message) {
	console.log('loaded!');
});
```

### 4. Send

마지막 `send` 입니다. 다른 `iframe` 혹은 `부모`에게 메세지를 전달하는 친구인데요, `type`은 호출할 `iframe` 내의 함수 명이며(위 `setTelepathy`를 참고해주세요!), `sender`는 본인의 `id`, `reciever`는 메세지를 전달받을 `iframe`의 `id`를 설정해주면 됩니다. 만약 부모에게 메세지를 보낼거라면 `parents`라고 적어주세요! 마지막 `params`는 전달할 실제 데이터 입니다.

```
Hatchery.send({
	type: 'init', // require
	sender: 'childA', // require
	reciever: 'childB', // require
	params: {
		name: 'Tamm Kwun',
		hobby: 'Sleep'
	}
});
```

## Browser Support

`window.postMessage` API를 제공하지 않는 `Internet Explorer 8` 미만 버전은 지원하지 않습니다.

## Bugs

사용하시다 버그가 있으면 `issue`에 남겨주시거나 `PR`(이걸 제일 좋아해요) 보내주시면 감사하겠습니다.