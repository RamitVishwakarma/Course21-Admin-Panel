import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

interface Quiz {
  title: string;
  questions: Question[];
}

type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | MultipleAnswersQuestion
  | MatchingQuestion;

interface MultipleChoiceQuestion {
  type: 'multiple_choice';
  question: string;
  options: string[];
  correctAnswer: string;
}

interface TrueFalseQuestion {
  type: 'true_false';
  question: string;
  correctAnswer: 'true' | 'false';
}

interface ShortAnswerQuestion {
  type: 'short_answer';
  question: string;
  correctAnswer: string;
}

interface MultipleAnswersQuestion {
  type: 'multiple_answers';
  question: string;
  options: string[];
  correctAnswer: string[];
}

interface MatchingQuestion {
  type: 'matching';
  question: string;
  options: Record<string, string>;
  correctAnswer: Record<string, string>;
}

const questionTypes = [
  { label: 'True/False', value: 'true_false' },
  { label: 'Multiple Choice', value: 'multiple_choice' },
  { label: 'Short Answer', value: 'short_answer' },
  { label: 'Multiple Answers', value: 'multiple_answers' },
  { label: 'Matching', value: 'matching' },
];

const QuizCreate = () => {
  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      title: '',
      questions: [{ type: 'true_false', content: {} }],
    },
  });

  const [questions, setQuestions] = useState([
    { type: 'true_false', content: {} },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { type: 'true_false', content: {} }]);
  };

  const updateQuestionType = (index: number, type: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = type;
    setQuestions(updatedQuestions);
  };

  const onSubmit = (data: any) => {
    const updatedQuestions = questions.map((question, index) => ({
      type: question.type,
      ...data.questions[index].content,
    }));

    const quizPayload = {
      title: data.title,
      questions: updatedQuestions,
    };

    console.log('Quiz payload:', quizPayload);
  };

  const renderQuestionForm = (question: any, index: number) => {
    switch (question.type) {
      case 'true_false':
        return <TrueFalseQuestion control={control} questionIndex={index} />;
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion control={control} questionIndex={index} />
        );
      case 'short_answer':
        return <ShortAnswerQuestion control={control} questionIndex={index} />;
      case 'multiple_answers':
        return (
          <MultipleAnswerQuestion control={control} questionIndex={index} />
        );
      case 'matching':
        return (
          <MatchingAnswerQuestion control={control} questionIndex={index} />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-10">
        {/* Quiz Title */}
        <Input
          {...register('title')}
          placeholder="Quiz Title"
          className="w-full mb-4"
        />

        {/* ShadCN Tabs to organize questions */}
        <Tabs defaultValue="question-0">
          <TabsList className="mb-4">
            {questions.map((_, index) => (
              <TabsTrigger key={index} value={`question-${index}`}>
                Question {index + 1}
              </TabsTrigger>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="ml-4 bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Question
            </button>
          </TabsList>

          {/* Each tab content for the question */}
          {questions.map((question, index) => (
            <TabsContent key={index} value={`question-${index}`}>
              <div className="border rounded p-4 mt-4">
                <h3 className="text-lg font-semibold mb-4">
                  Question {index + 1}
                </h3>

                {/* Dropdown to select question type */}
                <select
                  value={question.type}
                  onChange={(e) => updateQuestionType(index, e.target.value)}
                  className="mb-4 p-2 border rounded"
                >
                  {questionTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Render form based on the question type */}
                {renderQuestionForm(question, index)}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Submit Quiz */}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4">
          Submit Quiz
        </button>
      </div>
    </form>
  );
};

interface TrueFalseQuestionProps {
  control: any;
  questionIndex: number;
}

const TrueFalseQuestion = ({
  control,
  questionIndex,
}: TrueFalseQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
    />
    <div>Set correct answer</div>

    <Controller
      control={control}
      name={`questions[${questionIndex}].content.correctAnswer`}
      defaultValue="true"
      render={({ field }) => (
        <RadioGroup
          value={field.value}
          onValueChange={(value) => field.onChange(value)} // Manually bind the value
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`r1_${questionIndex}`} />
            <Label htmlFor={`r1_${questionIndex}`}>True</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`r2_${questionIndex}`} />
            <Label htmlFor={`r2_${questionIndex}`}>False</Label>
          </div>
        </RadioGroup>
      )}
    />
  </div>
);

interface MultipleChoiceQuestionProps {
  control: any;
  questionIndex: number;
}

const MultipleChoiceQuestion = ({
  control,
  questionIndex,
}: MultipleChoiceQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
    />
    <div>Set correct answer</div>
    <Controller
      control={control}
      name={`questions[${questionIndex}].content.correctAnswer`}
      defaultValue="1"
      render={({ field }) => (
        <RadioGroup
          value={field.value}
          onValueChange={(value) => field.onChange(value)} // Manually bind the value
        >
          {[0, 1, 2, 3].map((optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <Input
                {...control.register(
                  `questions[${questionIndex}].content.options[${optionIndex}]`,
                )}
                className="w-1/2"
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
              />
              <RadioGroupItem
                value={`${optionIndex + 1}`}
                id={`mcq_${optionIndex}_${questionIndex}`}
              />
              <Label htmlFor={`mcq_${optionIndex}_${questionIndex}`}>
                Option {optionIndex + 1}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    />
  </div>
);

interface ShortAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const ShortAnswerQuestion = ({
  control,
  questionIndex,
}: ShortAnswerQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
    />
    <div>Set correct answer</div>
    <Input
      {...control.register(`questions[${questionIndex}].content.correctAnswer`)}
      type="text"
      placeholder="Correct answer"
    />
  </div>
);

interface MultipleAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const MultipleAnswerQuestion = ({
  control,
  questionIndex,
}: MultipleAnswerQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
    />
    <div>Set correct answer</div>
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Input
            {...control.register(
              `questions[${questionIndex}].content.options[${optionIndex}]`,
            )}
            className="w-1/2"
            type="text"
            placeholder={`Option ${optionIndex + 1}`}
          />
          <Controller
            control={control}
            name={`questions[${questionIndex}].content.correctAnswer`}
            render={({ field }) => (
              <Checkbox {...field} value={`option_${optionIndex}`} />
            )}
          />
        </div>
      ))}
    </div>
  </div>
);

interface MatchingAnswerQuestionProps {
  control: any;
  questionIndex: number;
}

const MatchingAnswerQuestion = ({
  control,
  questionIndex,
}: MatchingAnswerQuestionProps) => (
  <div>
    <Textarea
      {...control.register(`questions[${questionIndex}].content.question`)}
      placeholder="Enter the question here"
    />
    <div>Set correct matches</div>
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Input
            {...control.register(
              `questions[${questionIndex}].content.options.option_${optionIndex}`,
            )}
            className="w-1/2"
            type="text"
            placeholder={`Option ${optionIndex + 1}`}
          />
          <Input
            {...control.register(
              `questions[${questionIndex}].content.correctAnswer.match_${optionIndex}`,
            )}
            className="w-1/2"
            type="text"
            placeholder={`Match ${optionIndex + 1}`}
          />
        </div>
      ))}
    </div>
  </div>
);

export default QuizCreate;
