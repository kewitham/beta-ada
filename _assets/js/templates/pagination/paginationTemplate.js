// Imports:
import nextButton from "./nextButtonTemplate";
import previousButton from "./previousButtonTemplate";
import ellipsis from "./ellipsisTemplate";
import paginationButton from "./paginationButtonTemplate";
import pageNumber from "./pageNumber";
import { firstPage, secondPageEtc, intermediatePages, secondToLastPage, lastPage } from "../../utils/paginationLogic/index"

export default function paginationTemplate(resultsArr, urlParams) {
  const offsetInt = parseInt(urlParams.get("offset"));
  pageNumber(resultsArr);
  if (resultsArr.length <= 7) {
    return `
        ${previousButton()}
        ${resultsArr
          .map(function(offsetValue, index, resArr) {
            return paginationButton(offsetValue, index, resArr);
          })
          .join(" ")}
        ${nextButton()}`;
  }
  return `
        ${previousButton()}
        ${paginationButton(resultsArr[0], 0, resultsArr)}
        ${
          // If we are on the first, second or third page of results hide the left ellipses
          offsetInt === 0 || offsetInt === 20 || offsetInt === 40
            ? ""
            : ellipsis(offsetInt, resultsArr)
        }
        ${resultsArr
          .map(function(offsetValue, index, resArr) {
            // If it is either the first page or last page, render nothing. The first and last page buttons are fixed.
            if (
              index === 0 ||
              index === resultsArr.indexOf(resultsArr[resultsArr.length - 1])
            ) {
              // If you are on the first page, render the next three page buttons.
            } else if (firstPage(offsetValue, offsetInt)) {
              return paginationButton(offsetValue, index, resArr);
              // If you are on the second page, render the second page button, third page button and fourth page button:
            } else if (secondPageEtc(offsetValue, offsetInt)) {
              return paginationButton(offsetValue, index, resArr);
              // If you are on the second to last page, render that page button and the previous two page buttons.
            } else if (secondToLastPage(offsetValue, offsetInt, resultsArr)) {
              return paginationButton(offsetValue, index, resArr);
              // If you are on the last page, render the previous 3 page buttons.
            } else if (lastPage(offsetValue, offsetInt, resultsArr)) {
              return paginationButton(offsetValue, index, resArr);
              // If you are on any other page, render that page button, the previous page button and the next page button.
            } else if (intermediatePages(urlParams, offsetValue, offsetInt)) {
              return paginationButton(offsetValue, index, resArr);
            }
          })
          .join(" ")}
        ${
          // If we are on the third to last, second to last or last page of results, hide the right ellipsis.
          offsetInt === resultsArr[resultsArr.length - 1] ||
          offsetInt === resultsArr[resultsArr.length - 2] ||
          offsetInt === resultsArr[resultsArr.length - 3]
            ? ""
            : ellipsis()
        }
        ${paginationButton(
          resultsArr[resultsArr.length - 1],
          resultsArr.indexOf(resultsArr[resultsArr.length - 1]),
          resultsArr
        )}
        ${nextButton()}`;
};
