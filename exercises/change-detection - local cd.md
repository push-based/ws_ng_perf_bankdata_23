# ChangeDetectionStrategy local cd (structural directives) exercises

In this exercise we will focus on advanced runtime & bootstrap optimizations in angular applications by using the power
of `Structural Directives`.

## Goal

In this exercise you will learn how to implement custom `Structural Directives` and find out various ways in order to
improve the change detection cycles of your application.
By the end of this exercise you will have implemented your own custom structural directive maintaining the change detection
locally for its view based on `Observable` input values.

## A Structural Directive

I've already prepared a skeleton directive for you in the `playground` folder.
Up until now, the `CdEmbeddedViewPlaygroundDirective` is just a regular attribute directive without any purpose. 

Your first task is to make it a `Structural Directive`.

Go to `CdEmbeddedViewPlaygroundDirective` and implement the missing parts to make it a structural directive.

A `Structural Directive` is able to create a (or multiple) `EmbeddedView`(s) from a `TemplateRef` into
its `ViewContainerRef`.

As a first step, we need to inject the `ViewContainerRef` and the `TemplateRef` into your directives' constructor.
Use `ViewContainerRef` to create an `EmbeddedView` in the on init method.

<details>
  <summary>Create EmbeddedViewRef</summary>

```ts
// cd-embedded-view-playground.directive.ts

constructor(
        private readonly templateRef: TemplateRef<any>,
        private readonly viewContainerRef: ViewContainerRef
) {}

ngOnInit(): void {
  const embeddedViewRef = this.viewContainerRef.createEmbeddedView(this.templateRef);
}

```
</details>

Great, the directive is ready to be used in the template. Go to `template-vs-embedded-view-playground.component.html`
and add the `cdEmbeddedViewCustom` directive into the `div.view-embedded` container.

For now, you don't need to set any input bindings. To test if it works, add the `<dirty-check-rounded>` component to your
template.

You can choose if you like to use `* syntax` as a shortcut or the more verbose `ng-template` syntax.

<details>
  <summary>Use `cdEmbeddedViewCustom`</summary>

```html
<!--template-vs-embedded-view-playground.component.html-->

<div class="view embedded">
  <div><strong>EmbeddedViewRef *cdEmbeddedViewCustom</strong></div>
  <!-- implement cdEmbeddedViewCustom here -->
  <ng-container *cdEmbeddedViewCustom>
    test
    <div>Dirty checks: <dirty-check-rounded></dirty-check-rounded></div>
  </ng-container>
</div>

```

</details>

Serve the application and navigate to the `playground` route. Confirm that your directive works as expected. It should
display the dirty check counter on interaction with the async update button.

```bash
ng serve
```

## Local ChangeDetection

Now we want to react to input and make use of local change detection with our `cdEmbeddedViewCustom` directive.

The directive needs to react to inputs from other components. Let's define an `@Input()` binding in order to hand over
a data source to the directive. Name the `@Input()` property the very same as the directives selector
`cdEmbeddedViewCustom` in order to have it as default input.

Since we want to handle value changes without updating the input binding, make the `@Input()` an `Obsevable`.

<details>
  <summary>Define Input binding</summary>

```ts
// cd-embedded-view-playground.directive.ts

@Input() cdEmbeddedViewCustom: Observable<any>;

```

</details>

Okay, now that our directive is able to receive data, we can pass the data as `context` to the `EmbeddedViewRef`.

After we've created the `EmbeddedView`, we can store an `EmbeddedViewRef` as reference to it in order to manipulate its
state.
What we want to achieve is to pass the values coming from the `Observable` to the `EmbeddedViewRef`.

* create a variable for the `embeddedViewRef` when creating it
* `subscribe` to the incoming `Observable`
* pass values from the `Observable` to `embeddedViewRef.context` property
  * Keep in mind, that the default context of an `EmbeddedViewRef` is the `$implicit` property
  * `{ $implicit: value }`
* re-evaluate the embeddedViewRefs template by calling `EmbeddedViewRef#detectChanges`


<details>
  <summary>Update Context On Value Changes</summary>

```ts
// cd-embedded-view-playground.directive.ts

ngOnInit() {
  // reference to EmbeddedViewRef
  const eRef = this.viewContainer.createEmbeddedView(this.templateRef);
  // subscribe to input
  this.subscription = this.cdEmbeddedViewCustom.subscribe(v => {
    // set implicit value
    eRef.context = { $implicit: v };
    // re-evaluate template
    eRef.detectChanges();
  });
}

```

</details>

The final step to make it work is to bind an actual value to the directive and use the context in the template.

Go to `template-vs-embedded-view-playground.component.html` and apply the pre-defined `value2$` as default input.
In order to read the implicit context, use the `let val` syntax.
Apply a template binding for the value read from the context.

<details>
  <summary>Use Input and Context</summary>

```hml
<!-- template-vs-embedded-view-playground.component.html -->

<ng-container *cdEmbeddedViewCustom="value2$; let val">
    {{ val }}
    <div>Dirty checks: <dirty-check-rounded></dirty-check-rounded></div>
</ng-container>
```
</details>

Great stuff, serve the application and interact with the async pipe and the directive binding. You should already notice
a difference between both actions in terms of dirty checks.

## Lazy View Creation

Let's try to refactor our directive so that it will create the `EmbeddedView` only after receiving a value.

Your only task will be to make sure the creation of the `EmbeddedView` happens the first time you receive a value from
the given `Observable`.

<details>
  <summary>Lazy View Creation</summary>

```ts
// cd-embedded-view-playground.directive.ts

let eRef: EmbeddedViewRef<any>;
    this.subscription = this.cdEmbeddedViewCustom.subscribe(v => {
      if (!eRef) {
        eRef = this.viewContainer.createEmbeddedView(this.templateRef);
      }
      eRef.context = { $implicit: v };
      eRef.detectChanges();
});

```
</details>

Nice job! Now serve the application. You should see no template for your embeddedViewRef until you interact with the
update button.

## Detach from ChangeDetection

As a final step let's try to make it possible so that our directives' template won't get re-evaluated from change detection
cycles of its parent component.

At the time the `EmbeddedView` gets created, you can simply `detach` it by calling its corresponding method.

<details>
  <summary>Detach from ChangeDetection</summary>

```ts
// cd-embedded-view-playground.directive.ts

let eRef: EmbeddedViewRef<any>;
this.subscription = this.cdEmbeddedViewCustom.subscribe((v) => {
  if (!eRef) {
    eRef = this.viewContainer.createEmbeddedView(this.templateRef);
    // detach
    eRef.detach();
  }
  eRef.context = { $implicit: v };
  eRef.detectChanges();
});
```
</details>

Very good then, please serve the application. Interact with both update buttons and take a look at the dirty check counters.
The counter of your directive shouldn't increase when you update the async pipes value.

