import { describe, expect, it } from "vitest";
import { createElement, parseAttributes } from "./createElement";

describe("parseAttributes", () => {
	it("parses simple key=value pairs", () => {
		expect(parseAttributes("foo=bar,baz=qux")).toEqual({
			foo: "bar",
			baz: "qux",
		});
	});

	it("parses quoted values", () => {
		expect(parseAttributes('foo="bar baz",baz="qux"')).toEqual({
			foo: "bar baz",
			baz: "qux",
		});
	});

	it("parses values with escaped quotes", () => {
		expect(parseAttributes('foo="bar\\"baz"')).toEqual({ foo: 'bar"baz' });
	});

	it("parses values with commas and equals in quotes", () => {
		expect(parseAttributes('foo="bar,baz=qux",x=1')).toEqual({
			foo: "bar,baz=qux",
			x: "1",
		});
	});

	it("handles empty input", () => {
		expect(parseAttributes("")).toEqual({});
	});
});

describe("createElement", () => {
	it("creates a div by default", () => {
		const el = createElement("div");
		expect(el.tagName).toBe("DIV");
	});

	it("sets id and classes from selector", () => {
		const el = createElement("span#myid.class1.class2");
		expect(el.id).toBe("myid");
		expect(el.className).toContain("class1");
		expect(el.className).toContain("class2");
		expect(el.tagName).toBe("SPAN");
	});

	it("sets attributes from selector", () => {
		const el = createElement('input[type=text,placeholder="foo"]');
		expect(el.getAttribute("type")).toBe("text");
		expect(el.getAttribute("placeholder")).toBe("foo");
	});

	it("merges attributes from selector and argument", () => {
		const el = createElement("input[type=text]", { placeholder: "bar" });
		expect(el.getAttribute("type")).toBe("text");
		expect(el.getAttribute("placeholder")).toBe("bar");
	});

	it("appends string and HTMLElement children", () => {
		const child = document.createElement("b");
		child.textContent = "bold";
		const el = createElement("div", {}, ["foo", child]);
		expect(el.childNodes.length).toBe(2);
		expect(el.childNodes[0].textContent).toBe("foo");
		expect(el.childNodes[1].tagName).toBe("B");
	});

	it("throws on invalid selector", () => {
		expect(() => createElement("!invalid")).toThrow();
	});

	it("throws on invalid child type", () => {
		// @ts-expect-error
		expect(() => createElement("div", {}, [123])).toThrow();
	});
});
