(<any>window)['HTMLCanvasElement'].prototype.getContext = async () => {
    return {};
};

import { SurveyPDF } from '../src/survey';
import { IRect, DocOptions, IDocOptions } from '../src/doc_controller';
import { FlatSurvey } from '../src/flat_layout/flat_survey';
import { FlatMultipleText } from '../src/flat_layout/flat_multipletext';
import { IPdfBrick } from '../src/pdf_render/pdf_brick';
import { SurveyHelper } from '../src/helper_survey';
import { TestHelper } from '../src/helper_test';
let __dummy_mt = new FlatMultipleText(null, null);

test('Check multiple text one item', async () => {
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi one item',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(1);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    };
    TestHelper.equalRect(expect, flats[0][0], assumeMultipleText);
    let assumeText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.leftTopPoint.xLeft +
            survey.controller.measureText(json.elements[0].items[0].name, 'bold').width,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[0], assumeText);
    let assumeBox: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft +
            SurveyHelper.getPageAvailableWidth(survey.controller) * SurveyHelper.MULTIPLETEXT_TEXT_PERS,
        xRight: assumeMultipleText.xRight,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height
    }
    TestHelper.equalRect(expect, flats[0][0].unfold()[1], assumeBox);
});
test('Check multiple text two items', async () => {
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                items: [
                    {
                        name: 'Input me'
                    },
                    {
                        name: 'Oh eee'
                    }
                ]
            }
        ]
    };
    let survey: SurveyPDF = new SurveyPDF(json, TestHelper.defaultOptions);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height * 2
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});
test('Check multiple text with colCount and long text', async () => {
    let sign: string = '|';
    let json = {
        elements: [
            {
                type: 'multipletext',
                name: 'multi',
                titleLocation: 'hidden',
                colCount: 2,
                items: [
                    {
                        name: sign
                    },
                    {
                        name: sign + sign
                    },
                    {
                        name: sign
                    }
                ]
            }
        ]
    };
    let options: IDocOptions = TestHelper.defaultOptions;
    let signWidth: number = new SurveyPDF(json, TestHelper.defaultOptions).
        controller.measureText(sign, 'bold').width / DocOptions.MM_TO_PT;
    options.format = [options.margins.left + options.margins.right +
        2.5 * signWidth / SurveyHelper.MULTIPLETEXT_TEXT_PERS, 297.0];
    let survey: SurveyPDF = new SurveyPDF(json, options);
    let flats: IPdfBrick[][] = await FlatSurvey.generateFlats(survey);
    expect(flats.length).toBe(1);
    expect(flats[0].length).toBe(2);
    let assumeMultipleText: IRect = {
        xLeft: survey.controller.leftTopPoint.xLeft,
        xRight: survey.controller.paperWidth - survey.controller.margins.right,
        yTop: survey.controller.leftTopPoint.yTop,
        yBot: survey.controller.leftTopPoint.yTop + survey.controller.measureText().height * 3
    };
    TestHelper.equalRect(expect, SurveyHelper.mergeRects(flats[0][0], flats[0][1]), assumeMultipleText);
});