import React from 'react';
import { Textarea } from '../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { useForm } from 'react-hook-form';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../components/ui/tabs';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import DefaultLayout from '@/layout/DefaultLayout';
import { useToast } from '@/components/ui/use-toast';
import { useQuizStore } from '@/store/useQuizStore';
import { useParams } from 'react-router-dom';

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
  const { moduleId } = useParams<{ moduleId: string }>();
  const { toast } = useToast();
  const { handleSubmit, control, register } = useForm({
    defaultValues: {
      title: '',
      questions: [{ type: 'true_false', content: {} }],
    },
  });

  // Get addQuiz function from our Zustand store
  const addQuiz = useQuizStore((state) => state.addQuiz);
  const fetchQuizzes = useQuizStore((state) => state.fetchQuizzes);

  // Ensure quizzes are loaded
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

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

    try {
      // Map the form data to our quiz store format
      const quizQuestions = updatedQuestions.map((q) => {
        // Prepare options array for multiple choice questions
        const options = [];
        if (q.type === 'multiple_choice' && q.options) {
          for (let i = 0; i < q.options.length; i++) {
            if (q.options[i]) {
              options.push({
                id: i + 1,
                text: q.options[i],
                correct: q.correctAnswer === `${i + 1}`,
              });
            }
          }
        }

        return {
          quiz_id: 0, // Will be set by the store
          question: q.question,
          type: q.type,
          options: options,
        };
      });

      // Add the quiz to our store
      addQuiz({
        title: data.title,
        description: 'Quiz created with the quiz editor',
        module_id: parseInt(moduleId || '0'),
        questions: quizQuestions,
      });

      toast({
        title: 'Quiz created successfully',
      });

      // Reset form or redirect
      window.location.href = `/admin/modules/${moduleId}`;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Quiz creation failed',
        variant: 'destructive',
      });
    }
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
    <DefaultLayout>
      <form className="size-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-10">
          {/* Quiz Title */}
          <Input
            {...register('title')}
            placeholder="Quiz Title"
            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          />

          {/* ShadCN Tabs to organize questions */}
          <Tabs defaultValue="question-0" className="flex flex-col gap-4">
            <TabsList className="flex flex-wrap items-center min-h-28 overflow-auto p-0 gap-2">
              {questions.map((_, index) => (
                <TabsTrigger
                  className="dark:data-[state=active]:bg-meta-3  data-[state=active]:bg-meta-3  data-[state=active]:text-white dark:ata-[state=active]:text-white data-[state=active]:rounded-lg dark:bg-meta-4 bg-meta-9 dark:text-white text-meta-4 size-8"
                  key={index}
                  value={`question-${index}`}
                >
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Each tab content for the question */}
            {questions.map((question, index) => (
              <TabsContent className="" key={index} value={`question-${index}`}>
                <div className="border-[0.5px] rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Question {index + 1}
                  </h3>

                  {/* Dropdown to select question type */}
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestionType(index, e.target.value)}
                    className="mb-4 py-2 px-4 border rounded border-stroke dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
          <div className="w-full flex gap-4 sticky bottom-0 flex-row-reverse">
            <button
              type="submit"
              className="bg-meta-5 flex-1 text-white px-4 py-2 rounded-xl"
            >
              Submit Quiz
            </button>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-meta-3 flex-1 text-white px-4 py-2 rounded-xl"
            >
              Add Question
            </button>
          </div>
        </div>
      </form>
    </DefaultLayout>
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
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
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
      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
                className="w-[80%] rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
    />
    <div>Set correct answer</div>
    <Input
      {...control.register(`questions[${questionIndex}].content.correctAnswer`)}
      type="text"
      placeholder="Correct answer"
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
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
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
    />
    <div>Set correct answer</div>
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Input
            {...control.register(
              `questions[${questionIndex}].content.options[${optionIndex}]`,
            )}
            className="w-[90%] rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
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
      className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
    />
    <div>Set correct matches</div>
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((optionIndex) => (
        <div key={optionIndex} className="flex items-center space-x-2">
          <Input
            {...control.register(
              `questions[${questionIndex}].content.options.option_${optionIndex}`,
            )}
            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
            type="text"
            placeholder={`Option ${optionIndex + 1}`}
          />
          <Input
            {...control.register(
              `questions[${questionIndex}].content.correctAnswer.match_${optionIndex}`,
            )}
            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"'
            type="text"
            placeholder={`Match ${optionIndex + 1}`}
          />
        </div>
      ))}
    </div>
  </div>
);

export default QuizCreate;
