import React from "react"
import "./loading.less"
import classnames from "classnames"

export function Spinner({show=true, green}) {
	const spinnerCN = classnames("Spinner", {show, green})
	return (
		<div className={spinnerCN}></div>
	)
}

export function PageLoading() {
	return (
		<div className="PageLoading">
			<Spinner></Spinner>
		</div>
	)
}